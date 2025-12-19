import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

/* CREATE */
router.post("/:classId/tasks", async (req, res) => {
  const task = await Task.create({
    classId: req.params.classId,
    title: req.body.title,
    dueDate: req.body.dueDate,
    description: req.body.description,
  });

  res.status(201).json(task);
});

/* READ */
router.get("/:classId/tasks", async (req, res) => {
  const tasks = await Task.find({
    classId: req.params.classId,
  }).sort({ createdAt: -1 });

  res.json(tasks);
});

/* UPDATE */
router.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(task);
});

/* DELETE */
router.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
