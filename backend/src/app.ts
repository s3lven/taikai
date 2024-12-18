import express from 'express';
import dotenv from 'dotenv';
import { Express, Request, Response } from 'express';
import tournamentRoutes from './routes/tournamentRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript Server' });
});

app.use('/api/tournaments', tournamentRoutes);

app.listen(port, () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`);
});
