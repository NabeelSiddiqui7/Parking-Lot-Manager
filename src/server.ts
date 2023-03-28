import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import errorMiddleware from '@middlewares/error.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export {app} ;