import express from "express";
import { bracketController } from "../controllers/bracketController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  bracketController.getBrackets(req, res, next);
});

router.post("/", async (req, res, next) => {
  bracketController.createBracket(req, res, next);
});

router.put("/batch-update", async (req, res, next) => {
  bracketController.batchUpdateBracket(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
  bracketController.deleteBracket(req, res, next);
});

router.patch("/:id/run", async (req, res, next) => {
  bracketController.runBracket(req, res, next);
});

router.patch("/:id/reset", async (req, res, next) => {
  bracketController.resetBracket(req, res, next);
});

router.patch("/:id/open", async (req, res, next) => {
  bracketController.openBracket(req, res, next);
});

router.patch("/:id/complete", async (req, res, next) => {
  bracketController.completeBracket(req, res, next);
});

export default router;
