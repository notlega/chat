import express from 'express';
import cors from 'cors';
import { join } from 'path';

import mainRouter from './routes/main.routes';

const app = express();

app.use(cors({
  origin: ['http://localhost:4200'],
  optionsSuccessStatus: 204,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(join(__dirname, 'assets')));

app.use('/apiv1', mainRouter);

export default app;
