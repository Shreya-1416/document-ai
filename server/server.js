import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

console.log("KEY:", process.env.OPENROUTER_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Document AI Backend Running Successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});