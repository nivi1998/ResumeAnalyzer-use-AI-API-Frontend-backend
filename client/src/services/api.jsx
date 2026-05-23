export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const res = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  console.log("API RESPONSE:", data);

  return data;
};

//analyzing file
//just for analysing the text
// export const analyzeResume = async (resumeText) => {
//   const res = await fetch("http://localhost:5000/api/analyze", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ resumeText })
//   });

//   return res.json();
// };