import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import assignmentService from '../../api/assignments';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';



const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python', judge0: 71 },
  { value: 'javascript', label: 'JavaScript', judge0: 63 },
  { value: 'cpp', label: 'C++', judge0: 54 },
  { value: 'java', label: 'Java', judge0: 62 },
];

const DEFAULT_CODE = {
  python: '# Write your Python code here',
  javascript: '// Write your JavaScript code here',
  cpp: '// Write your C++ code here',
  java: '// Write your Java code here',
};

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.REACT_APP_JUDGE0_API_KEY,
};

const CodingAssignmentAttempt = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  // answers: { [questionIdx]: { language: string, code: string } }
  const [answers, setAnswers] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  // Initialize assignment and answers
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getCodingAssignmentById(id, user.token);
        setAssignment(data);
        // Initialize answers for each question if not already set
        setAnswers(prev => {
          const newAnswers = { ...prev };
          data.questions.forEach((q, idx) => {
            if (!newAnswers[idx]) {
              newAnswers[idx] = {
                language: 'python',
                code: DEFAULT_CODE['python'],
              };
            }
          });
          return newAnswers;
        });
      } catch (err) {
        setError('Error fetching assignment');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
    // eslint-disable-next-line
  }, [id, user.token]);

  // When changing question, clear run result
  useEffect(() => {
    setRunResult(null);
  }, [currentQuestionIdx]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) {
    return <div className="text-center mt-16 text-lg text-gray-700">Assignment not found.</div>;
  }

  const question = assignment.questions[currentQuestionIdx];
  const answer = answers[currentQuestionIdx] || { language: 'python', code: DEFAULT_CODE['python'] };
  const { language, code } = answer;
  const langObj = LANGUAGE_OPTIONS.find(l => l.value === language);

  // Handle code change
  const handleCodeChange = (newCode) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: {
        ...prev[currentQuestionIdx],
        code: newCode
      }
    }));
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: {
        language: newLang,
        code: prev[currentQuestionIdx]?.language === newLang
          ? prev[currentQuestionIdx]?.code
          : DEFAULT_CODE[newLang]
      }
    }));
  };

  // Run code with Judge0
  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    setError('');
    try {
      const input = question.sampleTestCases[0]?.input || '';
      const expectedOutput = question.sampleTestCases[0]?.output?.trim() ?? '';
      const response = await axios.post(
        JUDGE0_API_URL,
        {
          source_code: code,
          language_id: langObj.judge0,
          stdin: input,
        },
        { headers: JUDGE0_HEADERS }
      );
      const output = (response.data.stdout ?? response.data.compile_output ?? response.data.stderr ?? '').trim();
      setRunResult({
        input,
        output,
        matched: output === expectedOutput,
        expectedOutput,
      });
    } catch (err) {
      setError('Error running code');
    } finally {
      setRunning(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) setCurrentQuestionIdx(currentQuestionIdx - 1);
  };
  const handleNext = () => {
    if (currentQuestionIdx < assignment.questions.length - 1) setCurrentQuestionIdx(currentQuestionIdx + 1);
  };

  // For demonstration: submit all answers (structure: { [questionIdx]: { language, code } })
  const handleSubmitAll = () => {
    // You can send the `answers` object to your backend here.
    console.log('Submitting answers:', answers);
    alert('Submitted! (see console for payload)');
  };

  return (
    <div className="w-screen min-h-screen h-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="w-full flex flex-col h-full">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            {/* Left Column */}
            <div className="flex flex-col h-full bg-white rounded-none shadow-none border-r border-purple-100">
              {/* Question (auto height, margin bottom) */}
              <div className="p-6 pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-purple-700">
                    Question {currentQuestionIdx + 1} of {assignment.questions.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1 rounded ${currentQuestionIdx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                      onClick={handlePrev}
                      disabled={currentQuestionIdx === 0}
                    >
                      &larr;
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${currentQuestionIdx === assignment.questions.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                      onClick={handleNext}
                      disabled={currentQuestionIdx === assignment.questions.length - 1}
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
                <div className="text-gray-800 whitespace-pre-line mb-4">{question.question}</div>
              </div>

              {/* Run/Test Case */}
              <div className="px-6 pb-6 flex flex-col space-y-4">
                <button
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                  onClick={handleRun}
                  type="button"
                  disabled={running}
                >
                  {running ? "Running..." : "Run"}
                </button>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-700">Sample Test Case</div>
                  {question.sampleTestCases.length > 0 ? (
                    <div className="bg-purple-50 border border-purple-100 rounded p-3 mb-2">
                      <div className="mb-1 text-xs text-purple-700">Input:</div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">{question.sampleTestCases[0].input}</pre>
                      <div className="mt-2 mb-1 text-xs text-purple-700">Expected Output:</div>
                      <pre className="bg-white rounded p-2 text-xs font-mono">{question.sampleTestCases[0].output}</pre>
                      {runResult && (
                        <div className="mt-2">
                          <div className="mb-1 text-xs text-green-700 font-semibold">Your Output:</div>
                          <pre className="bg-green-50 border border-green-200 rounded p-2 text-xs font-mono">{runResult.output}</pre>
                          {runResult.matched ? (
                            <div className="mt-2 text-green-600 font-semibold">Matched</div>
                          ) : (
                            <div className="mt-2 text-red-600 font-semibold">Not Matched</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No sample test cases.</div>
                  )}
                </div>
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors mt-2"
                  onClick={handleSubmitAll}
                  type="button"
                >
                  Submit All Answers
                </button>
              </div>
            </div>

            {/* Right Column: Monaco Editor */}
            <div className="h-full bg-white flex flex-col border-l border-purple-100">
              <div className="flex items-center justify-between px-6 py-3 border-b border-purple-50 bg-purple-50">
                <span className="font-semibold text-purple-700">Code Editor</span>
                <select
                  className="ml-4 px-3 py-1 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {LANGUAGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-h-[80vh]">
                <MonacoEditor
                  height="100%"
                  language={language}
                  theme="vs-light"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssignmentAttempt;
