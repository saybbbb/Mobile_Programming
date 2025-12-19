import mongoose from "mongoose";
import Student from "./Student.js";

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
 * Cascade delete students when a class is deleted
 */
classSchema.pre("findOneAndDelete", async function (next) {
  const classId = this.getQuery()._id;
  await Student.deleteMany({ classId });
});

export default mongoose.model("Class", classSchema);
