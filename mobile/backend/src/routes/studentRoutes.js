// routes/studentRoutes.js
import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * CREATE student
 * POST /api/classes/:classId/students
 */
router.post("/:classId/students", async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, studentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const student = await Student.create({
      classId,
      name,
      studentId,
    });

    res.status(201).json(student);
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);
    res.status(500).json({ message: "Failed to create student" });
  }
});

/**
 * GET students per class
 * GET /api/classes/:classId/students
 */
router.get("/:classId/students", async (req, res) => {
  try {
    const students = await Student.find({
      classId: req.params.classId,
    }).sort({ createdAt: 1 });

    res.json(students);
  } catch (err) {
    console.error("FETCH STUDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

/**
 * UPDATE student
 * PUT /api/classes/students/:id
 */
router.put("/students/:id", async (req, res) => {
  try {
    const { name, studentId } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, studentId },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("UPDATE STUDENT ERROR:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
});

/**
 * DELETE student
 * DELETE /api/classes/students/:id
 */
router.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE STUDENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

export default router;
