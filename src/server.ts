import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorMiddleware from '@middlewares/error.middleware';
import ManagerRoute from '@routes/manager.route';
import UserRoute from '@routes/user.route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('body-parser').urlencoded({ extended: true }));


const appRoutes = [new UserRoute, new ManagerRoute];
appRoutes.forEach(route => {
  app.use('/', route.router);
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export { app };