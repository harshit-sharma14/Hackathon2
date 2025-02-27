import { useState } from "react";
import axios from "axios";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setParsedData(response.data.parsedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setParsedData(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Resume (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4 border p-2 w-full" />
        <button onClick={handleUpload} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Upload</button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {parsedData && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="font-semibold">Parsed Data:</h3>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(parsedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
