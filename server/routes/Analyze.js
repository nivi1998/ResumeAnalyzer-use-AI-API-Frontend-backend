import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/analyzeController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), analyzeResume);

export default router;



//file analysis

//simple text analyzer
// import express from "express";
// import { analyzeResume } from "../controllers/analyzeController.js";

// const router = express.Router();

// router.post("/", analyzeResume);

// export default router;