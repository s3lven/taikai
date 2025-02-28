import express from "express";
import { bracketController } from "../controllers/bracketController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  bracketController.getBrackets(req, res, next)
});

router.post("/", async (req, res, next) => {
  bracketController.createBracket(req, res, next)
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Editing bracket ${id}` });
});

router.delete("/:id", async (req, res, next) => {
  bracketController.deleteBracket(req, res, next)
});

export default router;
