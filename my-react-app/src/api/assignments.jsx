import axios from 'axios';

const API_URL = 'http://localhost:5000/api/assignments';

// Create new assignment
const createAssignment = async (assignmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(API_URL, assignmentData, config);
  return response.data;
};

// Get all assignments
const getAssignments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get single assignment
const getAssignmentById = async (assignmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + '/' + assignmentId, config);
  return response.data;
};

// Download assignment file
const downloadAssignmentFile = async (assignmentId, fileType, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  };
  const response = await axios.get(
    API_URL + '/' + assignmentId + '/download/' + fileType,
    config
  );
  return response.data;
};

const assignmentService = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  downloadAssignmentFile,
};

export default assignmentService;
