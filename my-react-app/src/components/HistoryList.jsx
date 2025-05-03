import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryList = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get("http://localhost:5011/api/summaries");
        setSummaries(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching history");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="history-list">
      <h3 className="mb-4">Previous Summaries</h3>
      {summaries.length === 0 ? (
        <p>No summaries found</p>
      ) : (
        <div className="list-group">
          {summaries.map((summary) => (
            <div key={summary._id} className="list-group-item mb-3">
              <h5>{summary.documentId?.originalName || "Unknown Document"}</h5>
              <small className="text-muted">
                {new Date(summary.createdAt).toLocaleString()}
              </small>
              <div className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
                {summary.summaryText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
