import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  InputLabel,
  FormControl,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import moment from "moment";
import {
  AddCustomer,
  getData,
  editCustomer,
  deleteUser,
} from "../../../Services/Services";
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
    console.log(customersEditData);

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

  return (
    <div
      style={{
        marginLeft: "10px",
        marginTop: "20px",
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

      {/* {console.log(customersEditData.createdAt)} */}
      <div className={classes.divCon}>
        <TextField
          variant="outlined"
          fullWidth
          name="lastName"
          label="Entry Date"
          // onChange={handleFormValueChange}

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
          <InputLabel id="demo-simple-select-filled-label">Subject:</InputLabel>
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
          <InputLabel id="demo-simple-select-filled-label">Teacher:</InputLabel>
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
          <InputLabel id="demo-simple-select-filled-label">Country:</InputLabel>
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
          <IconButton
            onClick={() => copyToClipboard(customersEditData.meetingLink)}
          >
            <FileCopyIcon />
          </IconButton>
        </div>
      </div>

      {disableEditButton ? (
        <Button
          variant="contained"
          onClick={() => setDisableEditButton(false)}
          style={{ marginRight: "15px", marginBottom: 10 }}
        >
          Edit
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onCustomerUpdate}
          style={{ marginRight: "15px", marginBottom: 10 }}
        >
          Submit
        </Button>
      )}

      <Button
        variant="contained"
        onClick={onUserDelete}
        style={{ backgroundColor: "#e74c3c", color: "white", marginBottom: 10 }}
      >
        Delete
      </Button>
    </div>
  );
};

export default CustomersDetailsMb;
