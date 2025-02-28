import express from "express";
import { tournamentController } from "../controllers/tournamentController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  tournamentController.getTournaments(req, res, next)
});

router.post("/", async (req, res, next) => {
  tournamentController.createTournament(req, res, next)
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Editing Tournament ${id}` });
});

router.delete("/:id", async (req, res, next) => {
  tournamentController.deleteTournament(req, res, next)
});

export default router;
