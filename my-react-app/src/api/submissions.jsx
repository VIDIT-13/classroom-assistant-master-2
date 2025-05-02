import axios from "axios";

const API_URL = `http://localhost:5001/api`;

// Create new submission
const createSubmission = async (assignmentId, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/assignments/${assignmentId}/submit`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to submit assignment"
    );
  }
};

// Get submissions for assignment
const getSubmissionsForAssignment = async (assignmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API_URL}/submit/assignments/${assignmentId}/submissions`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch submissions"
    );
  }
};
// Get student's submission for an assignment
const getStudentSubmission = async (assignmentId, studentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API_URL}/submit/assignments/${assignmentId}/student/${studentId}`,
      config
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    // Handle 404 specifically (no submission found)
    console.error("Error fetching student submission:", error);
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Get single submission
const getSubmissionById = async (submissionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(
      `${API_URL}/submissions/${submissionId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch submission"
    );
  }
};

// Download submission file
const downloadSubmissionFile = async (submissionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };

  try {
    const response = await axios.get(
      `${API_URL}/submissions/${submissionId}/download`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download submission"
    );
  }
};

// Grade submission
const gradeSubmission = async (submissionId, gradeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${API_URL}/submissions/${submissionId}/grade`,
      gradeData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to grade submission"
    );
  }
};
const createOrUpdateSubmission = async (assignmentId, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(
    `${API_URL}/submit/assignments/${assignmentId}/submissions`, // Correct endpoint
    formData,
    config
  );
  return response.data;
};
const submissionService = {
  createOrUpdateSubmission,
  createSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission,
  getStudentSubmission,
};

export default submissionService;
