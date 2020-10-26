import axios from "axios";
import { isAutheticated } from "../auth";
import { services } from "./config";
import Axios from "axios";
const API = services["prod"];

export const login = (userId, password) => {
  var postData = {
    userId,
    password,
  };
  console.log(postData)
  return fetch(`${API.main}${API.login}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(postData),
  });
};

export const logout = (next) => {
  if (typeof window !== "undefined") {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    next();
  }
};

export const getTodayMeetings = (userid) => {
  return axios.post(
    `${API}/room/${userid}`,
    {
      date: new Date(),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAutheticated().token}`,
      },
    }
  );
};

export const getAllStudents = () => {
  return axios.get(`${API}/students`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const postMeeting = (
  teacher,
  student,
  startDate,
  endDate,
  startTime,
  endTime,
  day
) => {
  return axios.post(
    `${API}/create/meeting`,
    { teacher, student, startDate, endDate, startTime, endTime, day },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const postStudent = (student, password, email) => {
  return axios.post(
    `${API}/create/student/${isAutheticated().data.userid}`,
    { student, password, email },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAutheticated().token}`,
      },
    }
  );
};

export const postTeacher = (teacher, password, email) => {
  return axios.post(
    `${API}/create/teacher/${isAutheticated().data.userid}`,
    { teacher, password, email },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAutheticated().token}`,
      },
    }
  );
};

export const updatePassword = (
  password,
  newPassword,
  confirmPassword,
  userId
) => {
  console.log(userId);
  return axios.post(
    `${API.main}${API.changePassword}`,
    { userId, password, newPassword, confirmPassword },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getMeeting = (token, time) => {
  return axios.post(
    `${API.main}/meeting`,
    { token, time },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getAllCustomerDetails = () => {

  return axios.get(`${API.main}${API.allCustomerDetails}`);
};

export const getData = (name) => {
  if (name === "Teacher") {
    console.log(`${API.main}${API[name]}`);
  }
  return Axios.get(`${API.main}${API[name]}`);
};

export const AddCustomer = (data) => {
  console.log(data)
  return Axios.post(`${API.main}${API.addCustomer}`, data);
};

export const editCustomer = (data) => {
  return Axios.post(`${API.main}${API["updateCustomer"]}`, data);
};

export const addInField = (name, data) => {
  // console.log(`${API.main}${API[name]}`)
  return Axios.post(`${API.main}${API[name]}`, data);
};

export const editField = (name, data) => {
  return Axios.post(`${API.main}${API[name]}`, data);
};

export const deleteField = (name, id) =>
  Axios.post(`${API.main}${API[name]}/${id}`)



export const getComments = (id) => {
  return axios.get(`${API.main}${API.getComment}/${id}`);
};

export const addComments = (formData) => {
  return axios.post(`${API.main}${API.addComment}`, formData);
};

export const updateComment = (data) => {
  return axios.post(`${API.main}${API.updateComment}`, data);
};

export const getAllAdmins = () => axios.get(`${API.main}${API.getAllAdmins}`)

export const getAllTeachers = () => axios.get(`${API.main}${API.getAllTeachers}`)
