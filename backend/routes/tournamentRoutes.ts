import express from "express";
import { tournamentController } from "../controllers/tournamentController";
import authenticateToken from "../middleware/authenticateSupabaseToken";

const router = express.Router();

router.get("/", authenticateToken, async (req, res, next) => {
  tournamentController.getTournaments(req, res, next);
});

router.get("/user-tournaments", authenticateToken, async (req, res, next) => {
  tournamentController.getUserTournaments(req, res, next);
});

router.post("/", authenticateToken, async (req, res, next) => {
  tournamentController.createTournament(req, res, next);
});

router.post("/:id/editor", authenticateToken, async (req, res, next) => {
  tournamentController.addTournamentEditor(req, res, next);
});

router.put("/:id", async (req, res, next) => {
  tournamentController.editTournament(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
  tournamentController.deleteTournament(req, res, next);
});

export default router;
