import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
  },
  { timestamps: true }
);

/* Prevent duplicates */
attendanceSchema.index(
  { classId: 1, studentId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
