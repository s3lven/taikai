import express from 'express';
import { getBracket, deleteBracket, addBracket } from '../controllers/bracketController';

const router = express.Router();

router.get('/:id', getBracket);

router.delete('/:id', deleteBracket);

router.post('/', addBracket);

export default router;
