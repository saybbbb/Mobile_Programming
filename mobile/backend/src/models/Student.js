import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentId: {
      type: String,
      trim: true,
    },

    grades: {
      midterm: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      final: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", StudentSchema);
