import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Class from "../models/Class.js";

const router = express.Router();

/* CREATE CLASS */
router.post("/", authMiddleware, async (req, res) => {
  const { course, section, schedule } = req.body;

  const newClass = await Class.create({
    course,
    section,
    schedule,
    instructor: req.user.id,
  });

  res.status(201).json(newClass);
});

/* READ ALL CLASSES (teacher only) */
router.get("/", authMiddleware, async (req, res) => {
  const classes = await Class.find({ instructor: req.user.id })
    .sort({ createdAt: -1 });

  res.json(classes);
});

/* READ SINGLE CLASS */
router.get("/:id", authMiddleware, async (req, res) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }

  res.json(classData);
});

/* UPDATE CLASS */
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Class.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

/* DELETE CLASS */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Class.findOneAndDelete({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE CLASS ERROR:", err);
    res.status(500).json({ message: "Failed to delete class" });
  }
});

export default router;
