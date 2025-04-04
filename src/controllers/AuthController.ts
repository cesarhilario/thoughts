import { User } from '@/models/User';
import type { Request, Response } from 'express';
import type Flash from 'express-flash';
import type { Session } from 'express-session';

import bcrypt from 'bcrypt';

export class AuthController {
  login(req: Request<Session>, res: Response) {
    res.render('auth/login');
  }

  async loginPost(req: Request<Session | typeof Flash>, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      res.render('auth/login', {
        message: 'Usuário não encontrado',
      });

      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      res.render('auth/login', {
        message: 'Senha inválida!',
      });
      return;
    }

    req.session.save(() => {
      res.redirect('/');
    });
  }

  register(req: Request, res: Response) {
    res.render('auth/register');
  }

  async registerPost(req: Request, res: Response) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('message', 'As senhas não conferem, tente novamente');
      res.render('auth/register');

      return;
    }

    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash('message', 'O e-mail já está em uso!');
      res.render('auth/register');

      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    User.create(user)
      .then((user) => {
        req.session.userid = user.id;
        req.flash('message', 'Cadastro realizado com sucesso!');

        req.session.save(() => {
          res.redirect('/');
        });
      })
      .catch((err) => console.log(err));
  }

  logout(req: Request, res: Response) {
    req.session.destroy(() => {});
    res.redirect('/login');
  }
}
