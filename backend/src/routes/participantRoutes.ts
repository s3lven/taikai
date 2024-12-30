import express from 'express'
import { getParticipants } from "../controllers/participantController"

const router = express.Router()

router.get('/:id', getParticipants)

export default router
