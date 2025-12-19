import mongoose from "mongoose";
import Attendance from "./Attendance.js";
import Bulletin from "./Bulletin.js";
import Student from "./Student.js";
import Task from "./Task.js";

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const classSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    schedule: {
      type: [scheduleSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * ===============================
 * CASCADE DELETE (ASYNC, SAFE)
 * ===============================
 * Triggered ONLY by:
 * Class.findOneAndDelete()
 */
classSchema.pre("findOneAndDelete", async function () {
  const classId = this.getQuery()._id;

  await Promise.all([
    Student.deleteMany({ classId }),
    Attendance.deleteMany({ classId }),
    Task.deleteMany({ classId }),
    Bulletin.deleteMany({ classId }),
  ]);
});

export default mongoose.model("Class", classSchema);
