import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analyzeRoute from "./routes/Analyze.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoute);

// app.listen(port, () => {
//   console.log("Server running ");
// });


// Local development only
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
