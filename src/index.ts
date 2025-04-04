import os from 'node:os';
import path from 'node:path';
import express, { type Request, type Response, type NextFunction } from 'express';
import flash from 'express-flash';
import { engine } from 'express-handlebars';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';

import { ThoughController } from './controllers/ThoughController';
import { sequelize } from './db/connection';

import authRoutes from './routes/AuthRoutes';
import thoughtsRoutes from './routes/ThoughtsRoutes';

const app = express();

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const FileStore = FileStoreFactory(session);

app.use(flash());

app.use(express.static(path.join(__dirname, './public')));

app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: () => {},
      path: path.join(os.tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
);

// Middleware para armazenar sessão localmente
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// Definição das rotas
app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

app.get('/', ThoughController.showThoughts);

// Sincronização do banco de dados e inicialização do servidor
sequelize
  .sync()
  .then(() => {
    app.listen(3333, () => console.log('Servidor rodando na porta 3333'));
  })
  .catch((err) => console.error(err));
