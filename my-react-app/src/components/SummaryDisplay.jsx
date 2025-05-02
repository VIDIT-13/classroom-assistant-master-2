import React, { useState } from "react";
import axios from "axios";

const SummaryDisplay = ({ documentId, extractedText }) => {
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5001/api/summaries",
        {
          documentId: documentId, // Ensure this is properly set
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSummary(response.data.summary.summaryText);
    } catch (err) {
      console.error("Full error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error generating summary"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="summary-container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Extracted Text</h5>
        </div>
        <div className="card-body">
          <div
            className="extracted-text mb-4"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {extractedText}
          </div>

          <button
            onClick={generateSummary}
            className="btn btn-success"
            disabled={isGenerating || !extractedText}
          >
            {isGenerating ? "Generating..." : "Generate Summary"}
          </button>

          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>

      {summary && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Generated Summary</h5>
          </div>
          <div className="card-body">
            <div className="summary-text" style={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;
