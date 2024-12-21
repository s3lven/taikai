import express from 'express';
import { getBracket } from '../controllers/bracketController';

const router = express.Router()

router.get('/:id', getBracket)

export default router