import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * GET attendance for class + date
 * GET /api/classes/:classId/attendance?date=YYYY-MM-DD
 */
router.get("/:classId/attendance", async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const students = await Student.find({ classId }).sort({ name: 1 });
    const attendance = await Attendance.find({ classId, date });

    const map = {};
    attendance.forEach(a => {
      map[a.studentId.toString()] = a.status;
    });

    const result = students.map(s => ({
      _id: s._id,
      name: s.name,
      status: map[s._id.toString()] || "Absent",
    }));

    res.json(result);
  } catch (err) {
    console.error("FETCH ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

/**
 * SAVE / UPDATE attendance
 * POST /api/classes/:classId/attendance
 */
router.post("/:classId/attendance", async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, records } = req.body;

    const ops = records.map(r => ({
      updateOne: {
        filter: {
          classId,
          studentId: r.studentId,
          date,
        },
        update: {
          $set: {
            status: r.status,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ success: true });
  } catch (err) {
    console.error("SAVE ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Failed to save attendance" });
  }
});

/**
 * GET attendance summary (multi-date)
 * GET /api/classes/:classId/attendance/summary
 */
router.get("/:classId/attendance/summary", async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({ classId }).sort({ name: 1 });
    const records = await Attendance.find({ classId });

    const stats = {};

    records.forEach(r => {
      const sid = r.studentId.toString();

      if (!stats[sid]) {
        stats[sid] = { present: 0, total: 0 };
      }

      stats[sid].total += 1;
      if (r.status === "Present") {
        stats[sid].present += 1;
      }
    });

    const result = students.map(s => {
      const stat = stats[s._id.toString()] || { present: 0, total: 0 };

      const percentage =
        stat.total === 0
          ? 0
          : Math.round((stat.present / stat.total) * 100);

      return {
        _id: s._id,
        name: s.name,
        attendance: percentage,
        present: stat.present,
        total: stat.total,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("ATTENDANCE SUMMARY ERROR:", err);
    res.status(500).json({ message: "Failed to compute attendance summary" });
  }
});

export default router;
