import express from "express";
import { tournamentController } from "../controllers/tournamentController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  tournamentController.getTournaments(req, res, next);
});

router.get("/:id/brackets", async (req, res, next) => {
  tournamentController.getBracketsByTournamentID(req, res, next);
});

router.post("/", async (req, res, next) => {
  tournamentController.createTournament(req, res, next);
});

router.put("/:id", async (req, res, next) => {
  tournamentController.editTournament(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
  tournamentController.deleteTournament(req, res, next);
});

export default router;
