import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userid: string; // ou `number` dependendo do tipo de `user.id`
  }
}
