import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import assignmentService from "../../api/assignments"; // Make sure this has getCodingAssignmentById
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const CodingAssignmentDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getCodingAssignmentById(
          id,
          user.token
        );
        setAssignment(data);
      } catch (err) {
        setError("Failed to load assignment.");
        console.error("Error fetching assignment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id, user.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading assignment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-16 text-lg text-red-600">{error}</div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center mt-16 text-lg text-gray-700">
        Assignment not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-purple-100">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          {assignment.title}
        </h1>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 space-x-6">
          <div className="flex items-center">
            <FaUser className="text-purple-400 mr-2" />
            <span>Teacher: {assignment.teacher?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-purple-400 mr-2" />
            <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
          </div>
        </div>
        <div className="mb-6 text-gray-700">{assignment.description}</div>
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            Coding Assignment
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          Questions
        </h2>
        {assignment.questions.map((q, idx) => (
          <div
            key={idx}
            className="mb-8 bg-white rounded-lg shadow p-6 border border-purple-50"
          >
            <div className="mb-2 text-lg font-semibold text-purple-800">
              Question {idx + 1}
            </div>
            <div className="mb-4 text-gray-800 whitespace-pre-line">
              {q.question}
            </div>
            <div className="mb-2">
              <div className="font-semibold text-green-700 mb-1">
                Sample Test Cases
              </div>
              {q.sampleTestCases.length > 0 ? (
                <ul className="space-y-2">
                  {q.sampleTestCases.map((tc, tcIdx) => (
                    <li
                      key={tcIdx}
                      className="bg-green-50 border border-green-100 rounded p-3"
                    >
                      <div className="text-xs text-green-800 mb-1">Input:</div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">
                        {tc.input}
                      </pre>
                      <div className="mt-1 text-xs text-green-800 mb-1">
                        Output:
                      </div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">
                        {tc.output}
                      </pre>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">
                  No sample test cases.
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-orange-700 mb-1">
                Hidden Test Cases
              </div>
              {q.hiddenTestCases.length > 0 ? (
                <ul className="space-y-2">
                  {q.hiddenTestCases.map((tc, tcIdx) => (
                    <li
                      key={tcIdx}
                      className="bg-orange-50 border border-orange-100 rounded p-3"
                    >
                      <div className="text-xs text-orange-800 mb-1">Input:</div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">
                        {tc.input}
                      </pre>
                      <div className="mt-1 text-xs text-orange-800 mb-1">
                        Output:
                      </div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">
                        {tc.output}
                      </pre>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">
                  No hidden test cases.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingAssignmentDetail;
