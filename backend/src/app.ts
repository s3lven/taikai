import { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import tournamentRoutes from './routes/tournamentRoutes';
import bracketRoutes from './routes/bracketRoutes';
import participantRoutes from './routes/participantRoutes'
import matchesRoutes from './routes/matchesRoutes'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript Server' });
});

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/brackets', bracketRoutes);
app.use('/api/participants', participantRoutes)
app.use('/api/matches', matchesRoutes)

app.listen(port, () => {
  console.log(`[SERVER]: Server is running on port ${port}`);
});
