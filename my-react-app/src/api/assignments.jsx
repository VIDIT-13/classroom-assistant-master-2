import axios from "axios";
// import { evaluateCodingAssignment } from "../../../Backend/controllers/assignmentController.js";

const API_URL = "http://localhost:5010/api/assignments";

// Create new assignment
const createAssignment = async (assignmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
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
  console.log(response);
  return response.data;
};

// Get single assignment
const getAssignmentById = async (assignmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "/" + assignmentId, config);
  return response.data;
};

const getCodingAssignmentById = async (assignmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "/coding/" + assignmentId, config);
  return response.data;
};

// Download assignment file
const downloadAssignmentFile = async (assignmentId, fileType, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };
  const response = await axios.get(
    API_URL + "/" + assignmentId + "/download/" + fileType,
    config
  );
  return response.data;
};

const createCodingAssignment = async (assignmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    `${API_URL}/coding`,
    assignmentData,
    config
  );
  return response.data;
};

const evaluateCodingAssignment = async (assignmentData, token) => {};

const assignmentService = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  getCodingAssignmentById,
  downloadAssignmentFile,
  createCodingAssignment,
  evaluateCodingAssignment,
};

export default assignmentService;
