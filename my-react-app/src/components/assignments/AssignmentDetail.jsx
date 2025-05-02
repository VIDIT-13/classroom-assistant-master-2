import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import assignmentService from "../../api/assignments";
import submissionService from "../../api/submissions";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import { FaFilePdf } from "react-icons/fa"; // For the PDF icon
import { FaLightbulb } from "react-icons/fa"; // For the lightbulb icon
import { jsPDF } from "jspdf"; // For generating PDFs
import { FaRobot } from "react-icons/fa"; // For the robot icon
import { motion } from "framer-motion";
import {
  FaDownload,
  FaInfoCircle,
  FaThumbsUp,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaStar,
  FaBook,
  FaProjectDiagram,
  FaClipboardList,
} from "react-icons/fa";
import { FaCalendarAlt, FaUser, FaEdit, FaCheckCircle } from "react-icons/fa";

var fullcontent;
var videoData2 = []; // Global variable to store video data
const extractYouTubeVideos = (text) => {
  const regex = /\*{2}([^*]+)\*{2}.*?(https:\/\/www\.youtube\.com\/[^\s)]+)/g;
  const videos = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    videos.push({
      title: match[1].trim(),
      url: match[2].trim(),
    });
  }
  videoData2 = videos; // Store the extracted videos in the global variable
  return;
};

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignment first
        const assignmentData = await assignmentService.getAssignmentById(
          id,
          user.token
        );
        setAssignment(assignmentData);

        // If user is a student, try to fetch submission
        if (user.role === "student") {
          try {
            const submissionData = await submissionService.getStudentSubmission(
              id,
              user._id,
              user.token
            );
            setSubmission(submissionData);
          } catch (submissionErr) {
            // Log the error for debugging
            console.error("Submission Fetch Error:", submissionErr);

            // If submission is not found, it's not a critical error for students
            if (submissionErr.response?.status === 404) {
              console.log("No existing submission for this assignment");
              setSubmission(null);
            } else {
              // For other errors, set an error message
              setError("Failed to fetch submission data");
            }
          } finally {
            setLoading(false);
          }
        } else {
          // For non-student roles, stop loading
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError(err.response?.data?.message || "Failed to fetch assignment");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user.token, user.role, user._id]);

  function extractLearningPathChart(fullcontent) {
    const startMarker = "Learning Path in Chart Format (Text)";
    const codeBlockStart = "```";
    const codeBlockEnd = "```";

    const startIndex = fullcontent.indexOf(startMarker);
    if (startIndex === -1) return "";

    const codeStartIndex = fullcontent.indexOf(codeBlockStart, startIndex);
    const codeEndIndex = fullcontent.indexOf(codeBlockEnd, codeStartIndex + 3);

    if (codeStartIndex === -1 || codeEndIndex === -1) return "";

    const extractedChart = fullcontent
      .substring(codeStartIndex + 3, codeEndIndex)
      .trim();
    return extractedChart;
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmitClick = () => {
    navigate(`/assignments/${id}/submit`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  // Helper function to extract specific sections from the summary text
  // const getSectionContent = (fullText, sectionTitle) => {
  //   const startIndex = fullText.indexOf(sectionTitle);
  //   if (startIndex === -1) return "Section not found";

  //   let endIndex = fullText.indexOf("\n**", startIndex + 1);
  //   if (endIndex === -1) endIndex = fullText.length;

  //   return fullText.substring(startIndex + sectionTitle.length, endIndex).trim();
  // };
  // Improved helper function to extract sections with start and end markers
  // const getSectionContent = (fullText, sectionTitle, nextSectionTitle = null) => {
  //   if (!fullText) return "Content not available";

  //   const startIndex = fullText.indexOf(sectionTitle);
  //   if (startIndex === -1) return "Section not found";

  //   let endIndex = nextSectionTitle ? fullText.indexOf(nextSectionTitle, startIndex) : fullText.length;
  //   if (endIndex === -1) endIndex = fullText.length;

  //   return fullText.substring(startIndex + sectionTitle.length, endIndex).trim();
  // };

  // Function to extract all improvement points
  const getCompleteImprovementPoints = (fullText) => {
    const section = getSectionContent(
      fullText,
      "3. Areas for Improvement",
      "4. Suggested Score (0-100)"
    );
    if (!section || section === "Section not found") return section;

    // Extract all bullet points
    const points = section
      .split("\n")
      .filter((line) => line.trim().startsWith("*"));
    return points.join("\n");
  };

  // Enhanced PDF download function
  const downloadSummaryAsPDF = async (content, filename) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Set initial styling
      doc.setFont("helvetica");
      doc.setTextColor(0, 0, 0);

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(102, 51, 153); // Purple
      doc.text(`AI Analysis Report: ${filename}`, 10, 20);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 30);

      let yPosition = 40;

      // Add all sections
      const sections = [
        {
          title: "Summary of Approach",
          content: getSectionContent(
            content,
            "1. Summary of the Student's Approach",
            "2. Key Strengths"
          ),
          icon: FaClipboardList,
        },
        {
          title: "Key Strengths",
          content: getSectionContent(
            content,
            "2. Key Strengths",
            "3. Areas for Improvement"
          ),
          icon: FaThumbsUp,
        },
        {
          title: "Areas for Improvement",
          content: getCompleteImprovementPoints(content),
          icon: FaExclamationTriangle,
        },
        {
          title: "Suggested Score",
          content: getSectionContent(
            content,
            "4. Suggested Score (0-100)",
            "Resources for Improvement"
          ),
          icon: FaStar,
        },
        {
          title: "Resources for Improvement",
          content: getSectionContent(
            content,
            "Resources for Improvement",
            "Set of Questions to Help the Student Understand the Topics Better"
          ),
          icon: FaBook,
        },
        {
          title: "Practice Questions",
          content: getSectionContent(
            content,
            "Set of Questions to Help the Student Understand the Topics Better",
            "Learning Path (Chart Format)"
          ),
          icon: FaQuestionCircle,
        },
        {
          title: "Learning Path",
          content: getSectionContent(
            content,
            "Learning Path (Chart Format)",
            "Important Notes for the Student"
          ),
          icon: FaProjectDiagram,
          isCode: true,
        },
        {
          title: "Important Notes",
          content: getSectionContent(
            content,
            "Important Notes for the Student"
          ),
          icon: FaLightbulb,
        },
      ];

      // Add each section
      sections.forEach((section) => {
        if (section.content && section.content !== "Section not found") {
          // Add section title
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 128); // Navy blue
          doc.text(`• ${section.title}`, 10, yPosition);
          yPosition += 8;

          // Add section content
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0); // Black

          if (section.isCode) {
            // For code/learning path, use monospace font
            doc.setFont("courier");
            const lines = doc.splitTextToSize(section.content, 180);
            doc.text(lines, 10, yPosition);
            doc.setFont("helvetica"); // Reset font
            yPosition += lines.length * 5 + 10;
          } else {
            const lines = doc.splitTextToSize(section.content, 180);
            doc.text(lines, 10, yPosition);
            yPosition += lines.length * 6 + 10;
          }

          // Add new page if needed
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        }
      });

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  // Function to download summary as PDF
  // const downloadSummaryAsPDF = async (content, filename) => {
  //   try {
  //     // const { jsPDF } = await import('jspdf');
  //     const doc = new jsPDF();

  //     // Split content into sections
  //     const sections = [
  //       { title: "Summary of Approach", content: getSectionContent(content, "1. Summary of the Student's Approach") },
  //       { title: "Key Strengths", content: getSectionContent(content, "2. Key Strengths") },
  //       { title: "Areas for Improvement", content: getSectionContent(content, "3. Areas for Improvement") },
  //       { title: "Resources", content: getSectionContent(content, "Resources for Improvement") },
  //       { title: "Learning Path", content: getSectionContent(content, "Learning Path (Chart Format)") },
  //       { title: "Important Notes", content: getSectionContent(content, "Important Notes for the Student") },
  //     ];

  //     // Add title
  //     doc.setFontSize(18);
  //     doc.text(`AI Analysis Report: ${filename}`, 10, 20);
  //     doc.setFontSize(12);
  //     doc.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 30);

  //     let yPosition = 40;

  //     // Add each section
  //     sections.forEach(section => {
  //       if (section.content && section.content !== "Section not found") {
  //         doc.setFontSize(14);
  //         doc.setTextColor(0, 0, 128); // Navy blue for titles
  //         doc.text(section.title, 10, yPosition);
  //         yPosition += 10;

  //         doc.setFontSize(11);
  //         doc.setTextColor(0, 0, 0); // Black for content

  //         // Split text into lines that fit the page width
  //         const lines = doc.splitTextToSize(section.content, 180);
  //         doc.text(lines, 10, yPosition);
  //         yPosition += (lines.length * 7) + 10; // Adjust line height

  //         // Add new page if we're near the bottom
  //         if (yPosition > 270) {
  //           doc.addPage();
  //           yPosition = 20;
  //         }
  //       }
  //     });

  //     doc.save(`${filename}.pdf`);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     alert("Failed to generate PDF. Please try again.");
  //   }
  // };

  // Improved section content extraction
  const getSectionContent = (
    fullText,
    sectionTitle,
    nextSectionTitle = null
  ) => {
    if (!fullText) return null;

    const startIndex = fullText.indexOf(sectionTitle);
    if (startIndex === -1) return null;

    let endIndex = nextSectionTitle
      ? fullText.indexOf(nextSectionTitle, startIndex)
      : fullText.length;
    if (endIndex === -1) endIndex = fullText.length;

    let content = fullText
      .substring(startIndex + sectionTitle.length, endIndex)
      .trim();

    // Clean up common formatting issues
    content = content
      .replace(/^\n+/, "") // Remove leading newlines
      .replace(/\n+$/, "") // Remove trailing newlines
      .replace(/^\*/, "") // Remove accidental bullet points at start
      .trim();
    fullcontent = content;

    console.log("Full Content:", fullcontent);
    videoData2 = extractYouTubeVideos(fullcontent);
    return content || null;
  };

  console.log("Video Data:", videoData2);

  // Store the video data globally after a delay (4 seconds)
  const videoData = [
    {
      videoId: "OkS9YkfW50s",
      title: "DSA One Shot",
      url: "https://www.youtube.com/watch?v=OkS9YkfW50s",
      thumbnailUrl: "https://img.youtube.com/vi/OkS9YkfW50s/mqdefault.jpg",
    },
    {
      videoId: "DsK35f8wyUw",
      title: "COA One Shot",
      url: "https://www.youtube.com/watch?v=DsK35f8wyUw",
      thumbnailUrl: "https://img.youtube.com/vi/DsK35f8wyUw/mqdefault.jpg",
    },
    {
      videoId: "YRnjGeQbsHQ",
      title: "DBMS One Shot",
      url: "https://www.youtube.com/watch?v=YRnjGeQbsHQ",
      thumbnailUrl: "https://img.youtube.com/vi/YRnjGeQbsHQ/mqdefault.jpg",
    },
    {
      videoId: "5UIGlm91mg8",
      title: "UHV One Shot",
      url: "https://www.youtube.com/watch?v=5UIGlm91mg8",
      thumbnailUrl: "https://img.youtube.com/vi/5UIGlm91mg8/mqdefault.jpg",
    },
    {
      videoId: "i0bxaUKQ4Jo",
      title: "Python One Shot",
      url: "https://www.youtube.com/watch?v=i0bxaUKQ4Jo",
      thumbnailUrl: "https://img.youtube.com/vi/i0bxaUKQ4Jo/mqdefault.jpg",
    },
    {
      videoId: "3obEP8eLsCw",
      title: "Operating System One Shot",
      url: "https://www.youtube.com/watch?v=3obEP8eLsCw",
      thumbnailUrl: "https://img.youtube.com/vi/3obEP8eLsCw/mqdefault.jpg",
    },
  ];

  // Example usage

  // Check if section exists
  const hasSection = (fullText, sectionTitle) => {
    return fullText?.includes(sectionTitle) || false;
  };
  function extractYoutubeLinks(text) {
    if (!text) return [];

    const youtubeRegex =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
    const matches = [];
    let match;

    while ((match = youtubeRegex.exec(text)) !== null) {
      const videoId = match[1];
      const url = match[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      matches.push({
        videoId,
        url,
        thumbnailUrl,
      });
    }

    return matches;
  }

  // Example usage

  // Clean markdown content
  const cleanMarkdown = (content) => {
    if (!content) return "";
    return content
      .replace(/^```[\s\S]*?\n/, "") // Remove code block markers if present
      .replace(/```$/, "")
      .trim();
  };

  // Render section only if it exists
  const renderSectionIfExists = (
    fullText,
    sectionTitle,
    displayTitle,
    icon,
    color = "purple",
    getBulletPoints = false,
    halfWidth = false
  ) => {
    const content = getSectionContent(
      fullText,
      sectionTitle,
      getNextSectionTitle(fullText, sectionTitle)
    );

    if (!content) return null;

    const displayContent = getBulletPoints
      ? extractBulletPoints(content)
      : content;

    const colorClasses = {
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        prose: "prose-purple",
      },
      blue: { bg: "bg-blue-50", text: "text-blue-700", prose: "prose-blue" },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        prose: "prose-orange",
      },
      red: { bg: "bg-red-50", text: "text-red-700", prose: "prose-red" },
      green: {
        bg: "bg-green-50",
        text: "text-green-700",
        prose: "prose-green",
      },
      cyan: { bg: "bg-cyan-50", text: "text-cyan-700", prose: "prose-cyan" },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        prose: "prose-yellow",
      },
    };

    return (
      <div className={`mb-8 ${halfWidth ? "w-full" : ""}`}>
        <h5
          className={`text-lg font-semibold ${colorClasses[color].text} mb-3 flex items-center`}
        >
          <span className="mr-2">{icon}</span>
          {displayTitle}
        </h5>
        <div
          className={`${colorClasses[color].prose} max-w-none ${colorClasses[color].bg} p-4 rounded-lg`}
        >
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </div>
      </div>
    );
  };

  // Extract all bullet points from content
  const extractBulletPoints = (content) => {
    if (!content) return "";
    return content
      .split("\n")
      .filter((line) => line.trim().startsWith("*"))
      .join("\n");
  };

  // Get the next section title dynamically
  const getNextSectionTitle = (fullText, currentSectionTitle) => {
    const sectionTitles = [
      "1. Summary of the Student's Approach",
      "2. Key Strengths",
      "3. Areas for Improvement",
      "4. Suggested Score (0-100)",
      "5. Resources for Improvement",
      "6. Set of Questions to Help the Student Understand the Topics Better",
      "7.Learning Path (Chart Format)",
      "8.Important Notes for the Student",
    ];

    const currentIndex = sectionTitles.indexOf(currentSectionTitle);
    if (currentIndex === -1 || currentIndex === sectionTitles.length - 1) {
      return null;
    }

    // Find the next existing section title
    for (let i = currentIndex + 1; i < sectionTitles.length; i++) {
      if (hasSection(fullText, sectionTitles[i])) {
        return sectionTitles[i];
      }
    }

    return null;
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.6, transition: { duration: 0.5 } },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading assignment details...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // Assignment not found
  if (!assignment) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-2">Not Found</h2>
          <p>Assignment not found</p>
          <Link
            to="/assignments"
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 inline-block"
          >
            Back to Assignments
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-8 relative min-h-screen">
      {/* Animated background bubbles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          variants={bubbleVariants}
          initial="initial"
          animate="animate"
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 100 + 20}px`,
            height: `${Math.random() * 100 + 20}px`,
            borderRadius: "100%",
            backgroundColor: "#E6D5F7",
            zIndex: 0,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-4xl z-10 relative"
      >
        {/* Header section with gradient background */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div
            className="p-6 text-white relative"
            style={{
              background:
                "linear-gradient(90deg, #6820C6 0%, #6563FF 65.5%, #AB04B7 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 mr-4 shadow-md">
                  <FaClipboardList size={24} />
                </div>
                <h2 className="text-2xl font-bold">Assignment Details</h2>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/assignments"
                  className="flex items-center bg-white text-purple-700 py-2 px-4 rounded-full hover:bg-purple-50 shadow-md"
                >
                  Back to Assignments
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Assignment Details Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-purple-100 rounded-xl p-6 shadow-md mb-6"
        >
          <h2 className="text-2xl font-bold text-purple-800">
            {assignment.title}
          </h2>
          <p className="text-gray-600 mt-2">{assignment.description}</p>

          <div className="flex flex-wrap items-center text-sm text-gray-500 mt-4 space-x-4">
            <div className="flex items-center">
              <FaUser className="text-purple-400 mr-2" />
              <span>Created by: {assignment.teacher?.name || "Unknown"}</span>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <FaCalendarAlt className="text-purple-400 mr-2" />
              <span>Due: {formatDate(assignment.dueDate)}</span>
              {new Date(assignment.dueDate) < new Date() && (
                <span className="ml-2 text-red-500 font-medium">
                  (Deadline passed)
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Assignment Files Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-purple-100 rounded-xl p-6 shadow-md mb-6"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-4">
            Assignment Files
          </h3>
          <div className="flex flex-wrap gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`${process.env.REACT_APP_API_URL}/api/submit/assignments/${assignment._id}/download/question`}
              download={`${assignment.title}_Questions.pdf`}
              className="flex items-center justify-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <FaDownload className="mr-2" />
              <span>Download Questions</span>
            </motion.a>

            {user.role === "teacher" && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`${process.env.REACT_APP_API_URL}/api/submit/assignments/${assignment._id}/download/answer`}
                download={`${assignment.title}_Answers.pdf`}
                className="flex items-center justify-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <FaDownload className="mr-2" />
                <span>Download Answer Key</span>
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Teacher Submission View */}
        {user.role === "teacher" && (
          <motion.div
            variants={itemVariants}
            className="bg-white border border-purple-100 rounded-xl p-6 shadow-md mb-6"
          >
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Manage Submissions
            </h3>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/assignments/${assignment._id}/submissions`}
                className="flex items-center justify-center bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors w-fit"
              >
                View All Submissions
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Student Submission Section */}
        {user.role === "student" && (
          <motion.div
            variants={itemVariants}
            className="bg-white border border-purple-100 rounded-xl p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Your Submission
            </h3>

            {/* Submission Status Box */}
            <div
              className={`rounded-lg p-6 mb-6 ${
                submission
                  ? "bg-green-50 border-l-4 border-green-400"
                  : "bg-yellow-50 border-l-4 border-yellow-400"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {submission ? (
                    <FaCheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-medium ${
                      submission ? "text-green-800" : "text-yellow-800"
                    }`}
                  >
                    {submission ? "Submission Complete" : "Submission Required"}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      submission ? "text-green-700" : "text-yellow-700"
                    }`}
                  >
                    <p>
                      {submission
                        ? "You have already submitted this assignment."
                        : "You haven't submitted this assignment yet. Please upload your solution."}
                    </p>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitClick}
                      className={`flex items-center py-2 px-6 rounded-lg transition-colors ${
                        submission
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      <FaEdit className="mr-2" />
                      {submission
                        ? "Update Submission"
                        : "Submit Your Solution Now"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Submission Details (if exists) */}
            {submission && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg border-purple-200 p-6 bg-white shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div>
                    <p className="text-gray-600 flex items-center">
                      <FaCalendarAlt className="text-purple-400 mr-2" />
                      <span className="font-medium">Submitted on:</span>{" "}
                      {formatDate(submission.submittedAt)}
                    </p>

                    {submission.grade && (
                      <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-purple-800">
                          Grade:{" "}
                          <span className="text-2xl">{submission.grade}%</span>
                        </p>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-purple-800">
                          Teacher Feedback:
                        </h4>
                        <p className="text-gray-700 mt-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex gap-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`${process.env.REACT_APP_API_URL}/api/submit/submissions/${submission._id}/download`}
                        download={`${assignment.title}_Your_Solution.pdf`}
                        className="flex items-center justify-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors w-full"
                      >
                        <FaDownload className="mr-2" />
                        <span>Download Your Submission</span>
                      </motion.a>
                      {submission.summary && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            downloadSummaryAsPDF(
                              submission.summary,
                              `${assignment.title}_AI_Report`
                            )
                          }
                          className="flex items-center justify-center bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors w-full"
                        >
                          <FaFilePdf className="mr-2" />
                          <span>Download AI Report (PDF)</span>
                        </motion.button>
                      )}
                    </div>
                    {submission.summary && (
                      <div className="mt-4">
                        <div className="flex  justify-between items-center mb-4">
                          <h4 className="font-semibold text-purple-800 flex items-center">
                            <FaRobot className="mr-2 text-purple-600" />
                            AI Analysis Report
                          </h4>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Generated {formatDate(submission.submittedAt)}
                          </span>
                        </div>

                        <div className="bg-white p-6  rounded-lg border border-gray-200 shadow-sm">
                          {/* Summary Sections */}
                          <div className="w-[45vw] mb-8">
                            <h5 className="text-lg font-semibold   text-purple-700 mb-3 flex items-center">
                              <FaClipboardList className="mr-2" />
                              Summary of Approach
                            </h5>
                            <div className="prose prose-purple max-w-none bg-purple-50 p-4 rounded-lg">
                              <ReactMarkdown>
                                {getSectionContent(
                                  submission.summary,
                                  "1. Summary of the Student's Approach",
                                  "2. Key Strengths"
                                )}
                              </ReactMarkdown>
                            </div>
                          </div>

                          <div className="w-[45vw] mb-8">
                            <h5 className="text-lg font-semibold  text-blue-700 mb-3 flex items-center">
                              <FaThumbsUp className="mr-2" />
                              Key Strengths
                            </h5>
                            <div className="prose prose-blue max-w-none bg-blue-50 p-4 rounded-lg">
                              <ReactMarkdown>
                                {getSectionContent(
                                  submission.summary,
                                  "2. Key Strengths",
                                  "3. Areas for Improvement"
                                )}
                              </ReactMarkdown>
                              
                            </div>
                          </div>

                          <div className="w-[45vw]  mb-8">
                            <h5 className="text-lg font-semibold  text-orange-700 mb-3 flex items-center">
                              <FaExclamationTriangle className="mr-2" />
                              Areas for Improvement
                            </h5>
                            <div className="prose prose-orange max-w-none bg-orange-50 p-4 rounded-lg">
                              <ReactMarkdown>
                                {getCompleteImprovementPoints(
                                  submission.summary
                                )}
                              </ReactMarkdown>
                            </div>
                          </div>

                          <div className="w-[45vw] text-[13px] mb-8">
                            <h5 className="text-lg font-semibold  text-red-700 mb-3 flex items-center">
                              <FaStar className="mr-2" />
                              Suggested Score
                            </h5>
                            <div className="prose prose-red max-w-none bg-red-50  p-4 rounded-lg">
                              <ReactMarkdown>
                                {getSectionContent(
                                  submission.summary,
                                  "4. Suggested Score (0-100)",
                                  "Resources for Improvement"
                                )}
                              </ReactMarkdown>
                            </div>
                          </div>

                          
                          <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                              One Night Study Lectures
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                              {videoData.map((video, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                  <img
                                    className="w-full h-48 object-cover cursor-pointer"
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                  />

                                  <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">
                                      {video.title}
                                    </h3>
                                    <div className="aspect-w-16 aspect-h-9">
                                      <iframe
                                        className="w-full h-full rounded-md"
                                        src={`https://www.youtube.com/embed/${video.videoId}`}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentDetail;
