import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ message: "Getting Brackets" });
});

router.post("/", async (req, res) => {
  res.json({ message: "Posting Brackets" });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Editing Bracket ${id}` });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Deleting Bracket ${id}` });
});

export default router;
