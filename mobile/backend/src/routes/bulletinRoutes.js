// routes/bulletinRoutes.js
import express from "express";
import Bulletin from "../models/Bulletin.js";

const router = express.Router();

/* CREATE */
router.post("/:classId/bulletins", async (req, res) => {
  const bulletin = await Bulletin.create({
    classId: req.params.classId,
    message: req.body.message,
  });

  res.status(201).json(bulletin);
});

/* READ */
router.get("/:classId/bulletins", async (req, res) => {
  const list = await Bulletin.find({
    classId: req.params.classId,
  }).sort({ createdAt: -1 });

  res.json(list);
});

/* DELETE */
router.delete("/bulletins/:id", async (req, res) => {
  await Bulletin.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
