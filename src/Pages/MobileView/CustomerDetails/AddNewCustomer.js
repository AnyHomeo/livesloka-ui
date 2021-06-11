import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import { AddCustomer, getData } from "../../../Services/Services";
import { isAutheticated } from "../../../auth";
import moment from "moment";
import { Edit, Trash, ArrowRightCircle } from "react-feather";
import MuiAlert from "@material-ui/lab/Alert";
import useDocumentTitle from "../../../Components/useDocumentTitle";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  textLable: {
    marginBottom: "10px",
    marginTop: "10px",
  },
  divCon: {
    marginTop: "10px",
    marginBottom: "10px",
  },
}));

const AddNewCustomer = () => {
  useDocumentTitle("Add New Customer");
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { state } = location;

  const [classesIdDropdown, setClassesIdDropdown] = useState();
  const [timezoneDropdown, setTimezoneDropdown] = useState();
  const [classStatusDropDown, setClassStatusDropDown] = useState();
  const [currencyDropdown, setCurrencyDropdown] = useState();
  const [teacherDropdown, setTeacherDropdown] = useState();
  const [agentDropdown, setAgentDropdown] = useState();
  const [categoryDropdown, setCategoryDropdown] = useState();
  const [subjectDropdown, setSubjectDropdown] = useState();
  const [countryDropdown, setCountryDropdown] = useState();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const [customersEditData, setCustomersEditData] = useState({
    age: state ? state?.data?.age : "",
    classId: state ? state?.data?.classId : "",
    classStatusId: "",
    countryId: state ? state?.data?.countryId : "",
    email: state ? state?.data?.email : "",
    firstName: state ? state?.data?.firstName : "",
    gender: state ? state?.data?.gender : "",
    isJoinButtonEnabledByAdmin: state
      ? state?.data?.isJoinButtonEnabledByAdmin
      : "",
    lastName: state ? state?.data?.lastName : "",
    noOfClasses: state ? state?.data?.noOfClasses : "",
    numberOfClassesBought: "",
    numberOfStudents: state ? state?.data?.numberOfStudents : "",
    proposedAmount: state ? state?.data?.proposedAmount : "",
    proposedCurrencyId: state ? state?.data?.proposedCurrencyId : "",
    subjectId: state ? state?.data?.subjectId : "",
    timeZoneId: state ? state?.data?.timeZoneId : "",
    updatedAt: state ? state?.data?.updatedAt : "",
    whatsAppnumber: state ? state?.data?.whatsAppnumber : "",
    meetingLink: "",
    scheduleDescription: "",
    categoryId: state ? state?.data?.categoryId : "",
    teacherId: "",
    isJoinButtonEnabledByAdmin: state
      ? state?.data?.isJoinButtonEnabledByAdmin
      : "",
    agentId: "",
    createdAt: moment(new Date()).format("l"),
  });

  const handleSwitchChange = (event) => {
    setCustomersEditData({
      ...customersEditData,
      agentId: isAutheticated().agentId,
      isJoinButtonEnabledByAdmin: event.target.checked,
    });
  };

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
  const [disableEditButton, setDisableEditButton] = useState(false);

  const handleDropDownChange = (e) => {
    setCustomersEditData({
      ...customersEditData,
      [e.target.name]: e.target.value,
    });
  };

  const addNewCustomer = async () => {
    try {
      const res = await AddCustomer(customersEditData);

      if (res.status === 200) {
        setSuccess(true);
        setResponse("Data saved successfully");
        setSnackBarOpen(true);
        history.push("/customer-data-mobile");
      }
    } catch (err) {
      console.log(err.response);

      setSuccess(false);
      setResponse("Something went wrong, Try again");
      setSnackBarOpen(true);
    }
  };

  return (
    // <div
    //   style={{
    //     marginLeft: "10px",
    //     marginTop: "20px",
    //   }}
    // >
    //   <div className={classes.divCon}>
    //     {/* <h3 className={classes.textLable}>Student Name: </h3> */}
    //     <TextField
    //       variant="outlined"
    //       name="firstName"
    //       value={customersEditData.firstName}
    //       onChange={handleFormValueChange}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>
    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Guardian: </h3>
    //     <TextField
    //       name="lastName"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.lastName}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>
    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Age: </h3>
    //     <TextField
    //       name="age"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.age}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>
    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Classes Paid: </h3>
    //     <TextField
    //       name="numberOfClassesBought"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.numberOfClassesBought}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Email: </h3>
    //     <TextField
    //       name="email"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.email}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Gender: </h3>
    //     <TextField
    //       name="gender"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.gender}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Schedule Des: </h3>
    //     <TextField
    //       name="scheduleDescription"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.scheduleDescription}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>No Of Classes: </h3>
    //     <TextField
    //       name="noOfClasses"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.noOfClasses}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>No Of Classes: </h3>
    //     <TextField
    //       name="numberOfClassesBought"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.numberOfClassesBought}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>No Of Students: </h3>
    //     <TextField
    //       name="numberOfStudents"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.numberOfStudents}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Proposed Amount: </h3>
    //     <TextField
    //       name="proposedAmount"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.proposedAmount}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Meeting Link: </h3>
    //     <TextField
    //       name="meetingLink"
    //       onChange={handleFormValueChange}
    //       value={customersEditData.meetingLink}
    //       InputProps={{
    //         readOnly: disableEditButton,
    //       }}
    //     />
    //   </div>
    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Class Name: </h3>
    //     <Select
    //       name="classId"
    //       style={{ width: "52%" }}
    //       value={customersEditData.classId}
    //       disabled={disableEditButton}
    //       onChange={handleDropDownChange}
    //     >
    //       {classesIdDropdown &&
    //         classesIdDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.className}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Class Status: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       labelId="demo-simple-select-label"
    //       id="demo-simple-select"
    //       value={customersEditData.classStatusId}
    //       disabled={disableEditButton}
    //       name="classStatusId"
    //       onChange={handleDropDownChange}
    //     >
    //       {classStatusDropDown &&
    //         classStatusDropDown.map((data) => (
    //           <MenuItem value={data.id}>{data.classStatusName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Currency: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //       value={customersEditData.proposedCurrencyId}
    //       disabled={disableEditButton}
    //       name="proposedCurrencyId"
    //       onChange={handleDropDownChange}
    //     >
    //       {currencyDropdown &&
    //         currencyDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.currencyName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Country: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       value={customersEditData.countryId}
    //       disabled={disableEditButton}
    //       name="countryId"
    //       onChange={handleDropDownChange}
    //     >
    //       {countryDropdown &&
    //         countryDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.countryName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Teacher: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       value={customersEditData.teacherId}
    //       disabled={disableEditButton}
    //       name="teacherId"
    //       onChange={handleDropDownChange}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //     >
    //       {teacherDropdown &&
    //         teacherDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.TeacherName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Subject: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       disabled={disableEditButton}
    //       name="subjectId"
    //       value={customersEditData.subjectId}
    //       onChange={handleDropDownChange}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //     >
    //       {subjectDropdown &&
    //         subjectDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.subjectName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>
    //   {/*
    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Agent: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       name="agentId"
    //       value={customersEditData.agentId}
    //       onChange={handleDropDownChange}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //     >
    //       {agentDropdown &&
    //         agentDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.AgentName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div> */}

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Time Zone: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       name="timeZoneId"
    //       value={customersEditData.timeZoneId}
    //       onChange={handleDropDownChange}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //     >
    //       {timezoneDropdown &&
    //         timezoneDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.timeZoneName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Category Name: </h3>
    //     <Select
    //       style={{ width: "52%" }}
    //       name="categoryId"
    //       value={customersEditData.categoryId}
    //       onChange={handleDropDownChange}
    //       disabled={disableEditButton}
    //       // onChange={handleChange}
    //     >
    //       {categoryDropdown &&
    //         categoryDropdown.map((data) => (
    //           <MenuItem value={data.id}>{data.categoryName}</MenuItem>
    //         ))}
    //     </Select>
    //   </div>

    //   <div className={classes.divCon}>
    //     <h3 className={classes.textLable}>Toggle Class Join: </h3>
    //     <Switch
    //       checked={customersEditData.isJoinButtonEnabledByAdmin}
    //       onChange={handleSwitchChange}
    //       color="primary"
    //       name="checkedB"
    //       inputProps={{ "aria-label": "primary checkbox" }}
    //     />
    //   </div>

    //   <Button
    //     variant="contained"
    //     style={{ backgroundColor: "#e74c3c", color: "white" }}
    //     onClick={addNewCustomer}
    //   >
    //     Submit
    //   </Button>
    // </div>

    <>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
      <div
        style={{
          marginLeft: "10px",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            <InputLabel id="demo-simple-select-filled-label">Agent:</InputLabel>
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
            {/* <IconButton
            onClick={() => copyToClipboard(customersEditData.meetingLink)}
          >
            <FileCopyIcon />
          </IconButton> */}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <>
            <IconButton onClick={addNewCustomer}>
              <ArrowRightCircle style={{ fontSize: 24 }} />
            </IconButton>
            <Button
              variant="contained"
              style={{ backgroundColor: "#27ae60", color: "white" }}
              onClick={addNewCustomer}
            >
              Submit
            </Button>
          </>
        </div>
      </div>
    </>
  );
};

export default AddNewCustomer;
