import express from 'express';
import { getAllTournaments } from '../controllers/tournamentController';
import { delayResponse } from '../middleware/delayResponse';

const router = express.Router();

router.get('/', delayResponse, getAllTournaments);

export default router;
