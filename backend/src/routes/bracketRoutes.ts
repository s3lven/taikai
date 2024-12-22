import express from 'express';
import { getBracket, deleteBracket, addBracket, batchUpdateBracket } from '../controllers/bracketController';

const router = express.Router();

router.get('/:id', getBracket);

router.delete('/:id', deleteBracket);

router.post('/', addBracket);

router.post('/changes', batchUpdateBracket);

export default router;
