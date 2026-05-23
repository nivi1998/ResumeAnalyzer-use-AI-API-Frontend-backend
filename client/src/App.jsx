import React, { useState } from "react";
import ResumeInput from "./component/Input";
import AnalysisResult from "./component/Results";
import Loader from "./component/Loader";
import { analyzeResume } from "./services/api";
import { use } from "react";
import "./App.css"

function App() {
  const [result, setResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (file, jobDescription) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="appContainer">
      <h1 className="title">AI Resume Analyzer</h1>
{/* <textarea
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      /> */}
      <ResumeInput onSubmit={handleAnalyze} />

      {loading && <Loader />}
      {result && <AnalysisResult data={result} />}
    </div>
  );
}

export default App;