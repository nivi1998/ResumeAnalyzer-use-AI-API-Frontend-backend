import React from "react";
import "./css/result.css";

function AnalysisResult({ data }) {
    if(!data) return null;
     if (data.error) {
    return <p className="errorText">{data.error}</p>;
  }
const scoreColor =
    data.score > 75 ? "#16a34a" : data.score > 50 ? "#f59e0b" : "#dc2626";
  
    return (
    <div className="resultContainer">
      <h2 className="resultAnalysis">Analysis Result</h2>

      {/* <p><strong>ATS Score:</strong> {data.score}</p> */}
    
  <div className="resultAnalysisDetails">
  <h2>ATS Score: {data.score}%</h2>
  <div className="progressBar">
    <div className="progressFill" 
    style={{
      width: `${data.score}%`,
      background: scoreColor
      
    }} />
  </div>


      <h3>Skills Found:</h3>
      <ul className="skillList">
        {data.skills?.length > 0 ? (
        data.skills.map((s, index) => (
          <li key={index}>{s}</li>
        ))
    ): (<li>No Skill Found</li>

    )}
      </ul>

      <h3>✅ Matched Skills :</h3>
      <ul className="skillList">
        {data?.matchedSkills?.map((skill, i) => (
          <li key={i} style={{ color: "green" }}>{skill}</li>
        ))}
      </ul>

      <h3 >❌ Missing Skills :</h3>
      <ul className="skillList">
        {data?.missingSkills?.map((s, i) => (
          <li key={i} style={{ color: "red" }}>{s}</li>
        ))}
      </ul>

      <h3>Suggestions:</h3>
      <p className="suggestions">{data.suggestions}</p>
  </div>
    </div>
  );
}

export default AnalysisResult;
