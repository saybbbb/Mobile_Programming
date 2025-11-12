import express from 'express';
import "dotenv/config.js";
import authRoutes from './routes/authRoutes.js';
import { connect } from 'mongoose';
import { connectDB } from './lib/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.listen(3000, ()=> {
  console.log('Server is running on port 3000 ${PORT}');
  connectDB();
});