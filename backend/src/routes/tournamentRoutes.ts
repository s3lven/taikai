import express from 'express';
import { createTournament, deleteTournament, getAllTournaments, updateTournament } from '../controllers/tournamentController';

const router = express.Router();

router.get('/', getAllTournaments)

router.post('/', createTournament);

router.delete('/:id', deleteTournament)

router.patch('/:id', updateTournament)


export default router;
