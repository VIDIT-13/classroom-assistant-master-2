import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setIsUploading(true);
      const response = await axios.post(
        "http://localhost:5001/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="pdfFile" className="form-label">
            Upload Handwritten PDF
          </label>
          <input
            type="file"
            className="form-control"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading || !file}
        >
          {isUploading ? "Processing..." : "Upload & Extract Text"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
