import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ message: "Getting Tournaments" });
});

router.post("/", async (req, res) => {
  res.json({ message: "Posting Tournaments" });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Editing Tournament ${id}` });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  res.json({ message: `Deleting Tournament ${id}` });
});

export default router;
