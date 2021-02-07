import React, { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem, Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { AddCustomer, getData } from "../../../Services/Services";
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
  const classes = useStyles();

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
    age: "",
    classId: "",
    classStatusId: "",
    countryId: "",
    email: "",
    firstName: "",
    gender: "",
    isJoinButtonEnabledByAdmin: "",
    lastName: "",
    noOfClasses: "",
    numberOfClassesBought: "",
    numberOfStudents: "",
    proposedAmount: "",
    proposedCurrencyId: "",
    subjectId: "",
    timeZoneId: "",
    whatsAppnumber: "",
    meetingLink: "",
    scheduleDescription: "",
    categoryId: "",
    teacherId: "",
    isJoinButtonEnabledByAdmin: false,
    agentId: "",
  });

  const handleSwitchChange = (event) => {
    setCustomersEditData({
      ...customersEditData,
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

  console.log(customersEditData);

  const addNewCustomer = async () => {
    try {
      const res = await AddCustomer(customersEditData);
      console.log(res);
    } catch (err) {
      console.log(err.response);
    }
  };
  return (
    <div
      style={{
        marginLeft: "10px",
        marginTop: "20px",
      }}
    >
      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Student Name: </h3>
        <TextField
          name="firstName"
          value={customersEditData.firstName}
          onChange={handleFormValueChange}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>
      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Guardian: </h3>
        <TextField
          name="lastName"
          onChange={handleFormValueChange}
          value={customersEditData.lastName}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>
      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Age: </h3>
        <TextField
          name="age"
          onChange={handleFormValueChange}
          value={customersEditData.age}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>
      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Classes Paid: </h3>
        <TextField
          name="numberOfClassesBought"
          onChange={handleFormValueChange}
          value={customersEditData.numberOfClassesBought}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Email: </h3>
        <TextField
          name="email"
          onChange={handleFormValueChange}
          value={customersEditData.email}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Gender: </h3>
        <TextField
          name="gender"
          onChange={handleFormValueChange}
          value={customersEditData.gender}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Schedule Des: </h3>
        <TextField
          name="scheduleDescription"
          onChange={handleFormValueChange}
          value={customersEditData.scheduleDescription}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>No Of Classes: </h3>
        <TextField
          name="noOfClasses"
          onChange={handleFormValueChange}
          value={customersEditData.noOfClasses}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>No Of Classes: </h3>
        <TextField
          name="numberOfClassesBought"
          onChange={handleFormValueChange}
          value={customersEditData.numberOfClassesBought}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>No Of Students: </h3>
        <TextField
          name="numberOfStudents"
          onChange={handleFormValueChange}
          value={customersEditData.numberOfStudents}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Proposed Amount: </h3>
        <TextField
          name="proposedAmount"
          onChange={handleFormValueChange}
          value={customersEditData.proposedAmount}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Meeting Link: </h3>
        <TextField
          name="meetingLink"
          onChange={handleFormValueChange}
          value={customersEditData.meetingLink}
          InputProps={{
            readOnly: disableEditButton,
          }}
        />
      </div>
      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Class Name: </h3>
        <Select
          name="classId"
          style={{ width: "52%" }}
          value={customersEditData.classId}
          disabled={disableEditButton}
          onChange={handleDropDownChange}
        >
          {classesIdDropdown &&
            classesIdDropdown.map((data) => (
              <MenuItem value={data.id}>{data.className}</MenuItem>
            ))}
        </Select>
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Class Status: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Currency: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Country: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Teacher: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Subject: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Agent: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Time Zone: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Category Name: </h3>
        <Select
          style={{ width: "52%" }}
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
      </div>

      <div className={classes.divCon}>
        <h3 className={classes.textLable}>Toggle Class Join: </h3>
        <Switch
          checked={customersEditData.isJoinButtonEnabledByAdmin}
          onChange={handleSwitchChange}
          color="primary"
          name="checkedB"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </div>

      <Button
        variant="contained"
        style={{ backgroundColor: "#e74c3c", color: "white" }}
        onClick={addNewCustomer}
      >
        Submit
      </Button>
    </div>
  );
};

export default AddNewCustomer;
