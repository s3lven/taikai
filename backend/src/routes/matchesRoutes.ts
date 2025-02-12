import express from 'express'
import { getMatches } from '../controllers/matchesController'

const router = express.Router()

router.get('/:id', getMatches)

export default router
