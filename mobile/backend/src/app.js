import express from "express";
import authRoutes from "./routes/authRoutes.js";
import bulletinRoutes from "./routes/bulletinRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/classes", studentRoutes);
app.use("/api/classes", bulletinRoutes);
app.use("/api/classes", taskRoutes);

export default app;
