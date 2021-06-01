import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";

import {
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  InputLabel,
  FormControl,
  IconButton,
  Card,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import moment from "moment";
import { getData, editCustomer, deleteUser } from "../../../Services/Services";
import { Edit, Trash, ArrowRightCircle } from "react-feather";
import { isAutheticated } from "../../../auth";
import StudentHistoryTable from "../../Admin/Crm/StudentsHistoryTable";
import Axios from "axios";
const useStyles = makeStyles((theme) => ({
  textLable: {
    marginBottom: "10px",
    marginTop: "10px",
  },
  divCon: {
    marginTop: "10px",
    marginBottom: "10px",
    width: "100%",
  },
  appBar: {
    position: "relative",
  },
}));
const CustomersDetailsMb = ({ location }) => {
  const classes = useStyles();

  const {
    state: { data },
  } = location;

  const [classesIdDropdown, setClassesIdDropdown] = useState();
  const [timezoneDropdown, setTimezoneDropdown] = useState();
  const [classStatusDropDown, setClassStatusDropDown] = useState();
  const [currencyDropdown, setCurrencyDropdown] = useState();
  const [teacherDropdown, setTeacherDropdown] = useState();
  const [agentDropdown, setAgentDropdown] = useState();
  const [categoryDropdown, setCategoryDropdown] = useState();
  const [subjectDropdown, setSubjectDropdown] = useState();
  const [countryDropdown, setCountryDropdown] = useState();

  const [customersEditData, setCustomersEditData] = useState({
    age: data.age,
    classId: data.classId,
    classStatusId: data.classStatusId,
    countryId: data.countryId,
    email: data.email,
    firstName: data.firstName,
    gender: data.gender,
    isJoinButtonEnabledByAdmin: data.isJoinButtonEnabledByAdmin,
    lastName: data.lastName,
    noOfClasses: data.noOfClasses,
    numberOfClassesBought: data.numberOfClassesBought,
    numberOfStudents: data.numberOfStudents,
    proposedAmount: data.proposedAmount,
    proposedCurrencyId: data.proposedCurrencyId,
    subjectId: data.subjectId,
    timeZoneId: data.timeZoneId,
    updatedAt: data.updatedAt,
    whatsAppnumber: data.whatsAppnumber,
    meetingLink: data.meetingLink,
    scheduleDescription: data.scheduleDescription,
    categoryId: data.categoryId,
    teacherId: data.teacherId,
    isJoinButtonEnabledByAdmin: data.isJoinButtonEnabledByAdmin,
    agentId: data.agentId,
    _id: data._id,
    createdAt: data.createdAt,
  });

  const handleSwitchChange = (event) => {
    setCustomersEditData({
      ...customersEditData,
      agentId: isAutheticated().agentId,
      isJoinButtonEnabledByAdmin: event.target.checked,
    });
  };

  const [meetingLinkCopy] = useState(customersEditData.meetingLink);

  const fetchDropDown = async (name) => {
    try {
      const data = await getData(name);
      if (name === "Class") {
        setClassesIdDropdown(data && data.data.result);
      } else if (name === "Time Zone") {
        setTimezoneDropdown(data && data.data.result);
      } else if (name === "Class Status") {
        setClassStatusDropDown(data && data.data.result);
      } else if (name === "Currency") {
        setCurrencyDropdown(data && data.data.result);
      } else if (name === "Country") {
        setCountryDropdown(data && data.data.result);
      } else if (name === "Teacher") {
        setTeacherDropdown(data && data.data.result);
      } else if (name === "Agent") {
        setAgentDropdown(data && data.data.result);
      } else if (name === "Category") {
        setCategoryDropdown(data && data.data.result);
      } else if (name === "Subject") {
        setSubjectDropdown(data && data.data.result);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchDropDown("Class");
    fetchDropDown("Time Zone");
    fetchDropDown("Class Status");
    fetchDropDown("Currency");
    fetchDropDown("Country");
    fetchDropDown("Teacher");
    fetchDropDown("Agent");
    fetchDropDown("Category");
    fetchDropDown("Subject");
  }, []);

  const handleFormValueChange = (e) => {
    setCustomersEditData({
      ...customersEditData,
      [e.target.name]: e.target.value,
    });
  };
  const [disableEditButton, setDisableEditButton] = useState(true);

  const onCustomerUpdate = async () => {
    try {
      const res = await editCustomer({ ...customersEditData, _id: data._id });
      if (res.status === 200) {
        setDisableEditButton(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const onUserDelete = async () => {
    try {
      const res = await deleteUser(data._id);
      if (res.status === 200) {
        window.open("/customer-data-mobile", "_self");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleDropDownChange = (e) => {
    setCustomersEditData({
      ...customersEditData,
      [e.target.name]: e.target.value,
    });
  };

  const copyToClipboard = (text) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [historyStudentData, setHistoryStudentData] = useState();
  const [historySelectedId, setHistorySelectedId] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const studentsHistorytable = async (id) => {
    const data = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/class-history/${id}`
    );
    setHistoryStudentData(data);
    setHistorySelectedId(id);

    if (data.status === 200) {
      setHistoryOpen(true);
    }
  };

  return (
    <div
      style={{
        marginLeft: "10px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {disableEditButton ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Class Status:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {classStatusDropDown &&
                  classStatusDropDown.map((data) => {
                    if (data.id === customersEditData.classStatusId) {
                      return <span>{data.classStatusName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                classStatusDropDown.map((data) => {
                  if (data.id === customersEditData.classStatusId) {
                    copyToClipboard(data.classStatusName);
                  }
                });
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}> Entry Date:</p>
            </Card>
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {moment(customersEditData.createdAt).format("l")}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.createdAt);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}> Timezone:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {timezoneDropdown &&
                  timezoneDropdown.map((data) => {
                    if (data.id === customersEditData.timeZoneId) {
                      return <span>{data.timeZoneName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                timezoneDropdown.map((data) => {
                  if (data.id === customersEditData.timeZoneId) {
                    copyToClipboard(data.timeZoneName);
                  }
                });
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}> Firstname:</p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.firstName}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.firstName);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}> Lastname:</p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.lastName}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.lastName);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold", fontSize: 14 }}>
                {" "}
                No Of Classes:
              </p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.noOfClasses}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.noOfClasses);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {" "}
                Classes Left:{" "}
              </p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <IconButton
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: -7,
                }}
                onClick={() => studentsHistorytable(customersEditData._id)}
              >
                {customersEditData.numberOfClassesBought}
              </IconButton>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.numberOfClassesBought);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Gender: </p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.gender}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.gender);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                marginTop: -5,

                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Class Name:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {classesIdDropdown &&
                  classesIdDropdown.map((data) => {
                    if (data.id === customersEditData.classId) {
                      return <span>{data.className}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  classesIdDropdown &&
                    classesIdDropdown.map((data) => {
                      if (data.id === customersEditData.classId) {
                        copyToClipboard(data.className);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Subject:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {subjectDropdown &&
                  subjectDropdown.map((data) => {
                    if (data.id === customersEditData.subjectId) {
                      return <span>{data.subjectName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  subjectDropdown &&
                    subjectDropdown.map((data) => {
                      if (data.id === customersEditData.subjectId) {
                        copyToClipboard(data.subjectName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Email:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.email}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.email);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold", fontSize: 14 }}>
                Whatsapp No:
              </p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.whatsAppnumber}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.whatsAppnumber);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Teacher:</p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {teacherDropdown &&
                  teacherDropdown.map((data) => {
                    if (data.id === customersEditData.teacherId) {
                      return <span>{data.TeacherName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  teacherDropdown &&
                    teacherDropdown.map((data) => {
                      if (data.id === customersEditData.teacherId) {
                        copyToClipboard(data.TeacherName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Country:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {countryDropdown &&
                  countryDropdown.map((data) => {
                    if (data.id === customersEditData.countryId) {
                      return <span>{data.countryName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  countryDropdown &&
                    countryDropdown.map((data) => {
                      if (data.id === customersEditData.countryId) {
                        copyToClipboard(data.countryName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold", fontSize: 14 }}>
                No Of Students:{" "}
              </p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                marginTop: -5,

                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.numberOfStudents}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.numberOfStudents);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Amount:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                borderRadius: 0,
                marginTop: -5,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.proposedAmount}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.proposedAmount);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                marginTop: -5,

                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Currency:</p>
            </Card>

            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                marginTop: -5,

                border: "1px solid #2980b9",
                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {currencyDropdown &&
                  currencyDropdown.map((data) => {
                    if (data.id === customersEditData.proposedCurrencyId) {
                      return <span>{data.currencyName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  currencyDropdown &&
                    currencyDropdown.map((data) => {
                      if (data.id === customersEditData.proposedCurrencyId) {
                        copyToClipboard(data.currencyName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginTop: -5,

                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Agent:</p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                border: "1px solid #2980b9",
                marginTop: -5,

                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {agentDropdown &&
                  agentDropdown.map((data) => {
                    if (data.id === customersEditData.agentId) {
                      return <span>{data.AgentName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  agentDropdown &&
                    agentDropdown.map((data) => {
                      if (data.id === customersEditData.agentId) {
                        copyToClipboard(data.AgentName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                marginTop: -5,

                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold", fontSize: 14 }}>
                Schedule Des:
              </p>
            </Card>
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                marginTop: -5,

                border: "1px solid #2980b9",
                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold", fontSize: 10 }}>
                {customersEditData.scheduleDescription}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.scheduleDescription);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                color: "white",
                borderRadius: 0,
                marginTop: -5,

                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Agent:</p>
            </Card>
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                marginTop: -5,

                border: "1px solid #2980b9",
                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {categoryDropdown &&
                  categoryDropdown.map((data) => {
                    if (data.id === customersEditData.categoryId) {
                      return <span>{data.categoryName}</span>;
                    }
                  })}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                {
                  categoryDropdown &&
                    categoryDropdown.map((data) => {
                      if (data.id === customersEditData.categoryId) {
                        copyToClipboard(data.categoryName);
                      }
                    });
                }
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Card
              style={{
                height: 30,
                width: "40%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#2980b9",
                marginTop: -5,

                color: "white",
                borderRadius: 0,
                border: "1px solid #2980b9",
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>Meeting Link:</p>
            </Card>{" "}
            <Card
              style={{
                height: 30,
                width: "55%",
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: "#ecf0f1",
                color: "black",
                marginTop: -5,

                border: "1px solid #2980b9",
                borderRadius: 0,
              }}
            >
              <p style={{ marginLeft: 5, fontWeight: "bold" }}>
                {customersEditData.meetingLink}
              </p>
            </Card>
            <IconButton
              style={{ marginTop: -15 }}
              onClick={() => {
                copyToClipboard(customersEditData.meetingLink);
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </div>
        </>
      ) : (
        <>
          <div
            className={classes.divCon}
            style={{ display: "flex", alignItems: "center" }}
          >
            <p>Toggle Class Join: </p>
            <Switch
              label="Toggle Class Join"
              fullWidth
              variant="outlined"
              checked={customersEditData.isJoinButtonEnabledByAdmin}
              onChange={handleSwitchChange}
              color="primary"
              name="checkedB"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </div>
          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Class Status:
              </InputLabel>
              <Select
                label="Class Status"
                fullWidth
                variant="outlined"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={customersEditData.classStatusId}
                disabled={disableEditButton}
                name="classStatusId"
                onChange={handleDropDownChange}
              >
                {classStatusDropDown &&
                  classStatusDropDown.map((data) => (
                    <MenuItem value={data.id}>{data.classStatusName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <TextField
              variant="outlined"
              fullWidth
              name="lastName"
              label="Entry Date"
              value={moment(customersEditData.createdAt).format("l")}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                TimeZone:
              </InputLabel>
              <Select
                label="Time Zone"
                fullWidth
                variant="outlined"
                name="timeZoneId"
                value={customersEditData.timeZoneId}
                onChange={handleDropDownChange}
                disabled={disableEditButton}
                // onChange={handleChange}
              >
                {timezoneDropdown &&
                  timezoneDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.timeZoneName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <TextField
              fullWidth
              variant="outlined"
              name="firstName"
              label="Student Name"
              value={customersEditData.firstName}
              onChange={handleFormValueChange}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>
          <div className={classes.divCon}>
            <TextField
              variant="outlined"
              fullWidth
              name="lastName"
              label="Guardian"
              onChange={handleFormValueChange}
              value={customersEditData.lastName}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>
          <div className={classes.divCon}>
            <TextField
              variant="outlined"
              fullWidth
              label="Age"
              name="age"
              onChange={handleFormValueChange}
              value={customersEditData.age}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <TextField
              label="No Of Classes"
              variant="outlined"
              fullWidth
              name="noOfClasses"
              onChange={handleFormValueChange}
              value={customersEditData.noOfClasses}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Classes Left"
              variant="outlined"
              fullWidth
              name="numberOfClassesBought"
              onChange={handleFormValueChange}
              value={customersEditData.numberOfClassesBought}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Gender"
              variant="outlined"
              fullWidth
              name="gender"
              onChange={handleFormValueChange}
              value={customersEditData.gender}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Class Name:
              </InputLabel>
              <Select
                label="Class Name"
                name="classId"
                fullWidth
                variant="outlined"
                value={customersEditData.classId}
                disabled={disableEditButton}
                onChange={handleDropDownChange}
              >
                {classesIdDropdown &&
                  classesIdDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.className}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Subject:
              </InputLabel>
              <Select
                label="Subject"
                fullWidth
                variant="outlined"
                disabled={disableEditButton}
                name="subjectId"
                value={customersEditData.subjectId}
                onChange={handleDropDownChange}
                disabled={disableEditButton}
                // onChange={handleChange}
              >
                {subjectDropdown &&
                  subjectDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.subjectName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              onChange={handleFormValueChange}
              value={customersEditData.email}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Whatsapp Number"
              variant="outlined"
              fullWidth
              name="whatsAppnumber"
              onChange={handleFormValueChange}
              value={customersEditData.whatsAppnumber}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Teacher:
              </InputLabel>
              <Select
                label="Teacher"
                fullWidth
                variant="outlined"
                value={customersEditData.teacherId}
                disabled={disableEditButton}
                name="teacherId"
                onChange={handleDropDownChange}
                disabled={disableEditButton}
                // onChange={handleChange}
              >
                {teacherDropdown &&
                  teacherDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.TeacherName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Country:
              </InputLabel>
              <Select
                label="Country"
                fullWidth
                variant="outlined"
                value={customersEditData.countryId}
                disabled={disableEditButton}
                name="countryId"
                onChange={handleDropDownChange}
              >
                {countryDropdown &&
                  countryDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.countryName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <TextField
              label="No Of Students"
              variant="outlined"
              fullWidth
              name="numberOfStudents"
              onChange={handleFormValueChange}
              value={customersEditData.numberOfStudents}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Proposed Amount"
              variant="outlined"
              fullWidth
              name="proposedAmount"
              onChange={handleFormValueChange}
              value={customersEditData.proposedAmount}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Currency:
              </InputLabel>
              <Select
                label="Currency"
                fullWidth
                variant="outlined"
                disabled={disableEditButton}
                // onChange={handleChange}
                value={customersEditData.proposedCurrencyId}
                disabled={disableEditButton}
                name="proposedCurrencyId"
                onChange={handleDropDownChange}
              >
                {currencyDropdown &&
                  currencyDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.currencyName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Agent:
              </InputLabel>
              <Select
                label="Agent"
                fullWidth
                variant="outlined"
                name="agentId"
                value={customersEditData.agentId}
                onChange={handleDropDownChange}
                disabled={disableEditButton}
                // onChange={handleChange}
              >
                {agentDropdown &&
                  agentDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.AgentName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <TextField
              label="Schedule Des"
              variant="outlined"
              fullWidth
              name="scheduleDescription"
              onChange={handleFormValueChange}
              value={customersEditData.scheduleDescription}
              InputProps={{
                readOnly: disableEditButton,
              }}
            />
          </div>

          <div className={classes.divCon}>
            <FormControl variant="outlined" style={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Category:
              </InputLabel>
              <Select
                label="Category Name"
                fullWidth
                variant="outlined"
                name="categoryId"
                value={customersEditData.categoryId}
                onChange={handleDropDownChange}
                disabled={disableEditButton}
                // onChange={handleChange}
              >
                {categoryDropdown &&
                  categoryDropdown.map((data) => (
                    <MenuItem value={data.id}>{data.categoryName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.divCon}>
            <div style={{ display: "flex" }}>
              <TextField
                label="Meeting Link"
                variant="outlined"
                fullWidth
                name="meetingLink"
                onChange={handleFormValueChange}
                value={customersEditData.meetingLink}
                InputProps={{
                  readOnly: true,
                }}
              />
              <IconButton
                onClick={() => copyToClipboard(customersEditData.meetingLink)}
              >
                <FileCopyIcon />
              </IconButton>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: "right" }}>
        {disableEditButton ? (
          <IconButton onClick={() => setDisableEditButton(false)}>
            <Edit style={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <IconButton onClick={onCustomerUpdate}>
            <ArrowRightCircle style={{ fontSize: 24 }} />
          </IconButton>
        )}

        <IconButton onClick={onUserDelete}>
          <Trash style={{ fontSize: 24 }} />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {disableEditButton ? (
          <Button
            variant="contained"
            onClick={() => setDisableEditButton(false)}
            style={{
              marginBottom: 10,
              width: 150,
              backgroundColor: "#27ae60",
              color: "white",
            }}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onCustomerUpdate}
            style={{ marginBottom: 10, width: 150 }}
          >
            Submit
          </Button>
        )}

        <Button
          variant="contained"
          onClick={onUserDelete}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            marginBottom: 10,
            width: 150,
          }}
        >
          Delete
        </Button>
      </div>

      {historyStudentData && (
        <Dialog
          open={historyOpen}
          fullWidth
          onClose={() => setHistoryOpen(false)}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setHistoryOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <StudentHistoryTable
            data={historyStudentData}
            id={historySelectedId}
          />
        </Dialog>
      )}
    </div>
  );
};

export default CustomersDetailsMb;
