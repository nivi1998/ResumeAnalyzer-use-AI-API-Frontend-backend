import React, { useState } from "react";
import "./css/input.css"

function ResumeInput({ onAnalyze, onSubmit }) {
  const [jobDescription, setJobDescription] = useState("");
   const [file, setFile] = useState(null);


  //   const handleDrop = (e) => {
  //   e.preventDefault();
  //   setFile(e.dataTransfer.files[0]);
  // };


   const handleSubmit = (e) => {
    e.preventDefault();
     if (!file) {
    alert("Please upload a PDF");
    return;
  }
    onSubmit(file, jobDescription);
    // if (!file) return alert("Upload PDF first");
    // onAnalyze(file);
  };


  return (
<div className="Container">
     <form onSubmit={handleSubmit} className="form">
      {/* <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? file.name : "Drag & Drop Resume PDF"}
      </div> */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="inputField"
      />
       <textarea
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={12}
        className="inputDesc"
      />


      <button type="submit" className="button" disabled={!file}>
        Upload & Analyze
      </button>
    </form>
    </div>
    // <div>
    //   <textarea
    //     rows="10"
    //     placeholder="Paste your resume..."
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //   />

    //   <button onClick={() => onAnalyze(text)}>
    //     Analyze Resume
    //   </button>
    // </div>


  );
}

export default ResumeInput;