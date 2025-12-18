import "dotenv/config.js";
import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
