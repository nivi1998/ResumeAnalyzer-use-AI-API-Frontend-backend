import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analyzeRoute from "./routes/Analyze.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});