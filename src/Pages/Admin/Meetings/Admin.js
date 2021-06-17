import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getAllTeachers,
  getAllStudents,
  postMeeting,
} from "../../../Services/Services";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  saveButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  nested: {
    paddingLeft: "2rem",
  },
  Startdate: {
    marginRight: "10px",
  },
  Starttime: {
    marginRight: "10px",
  },
  content: {
    flexGrow: 1,
    marginTop: "-10px",
    textAlign: "center",
  },
}));
const Admin = () => {
  const [day, setDay] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const time = new Date();
  const [startDate, setStartDate] = useState(time);
  const [endDate, setEndDate] = useState(time);
  const [startTime, setStartTime] = useState(time);
  const [endTime, setEndTime] = useState(time);
  const [teachers, setTeachers] = useState([""]);
  const [students, setStudents] = useState([""]);
  const [teacher, setInputTeacher] = useState("");
  const [student, setInputStudent] = useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleStartTimeChange = (data) => {
    setStartTime(data);
  };
  const handleEndTimeChange = (data) => {
    setEndTime(data);
  };
  const handleChange = (event) => {
    setDay({ ...day, [event.target.name]: event.target.checked });
  };
  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  useEffect(() => {
    getAllStudents().then((data) =>
      setStudents(
        data.data.map((name) => `${name.STUDENT_NAME}(${name.STUDENT_ID})`)
      )
    );
    getAllTeachers().then((data) =>
      setTeachers(
        data.data.map((name) => `${name.TEACHER_NAME}(${name.TEACHER_ID})`)
      )
    );
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    postMeeting(
      teacher,
      student,
      startDate,
      endDate,
      startTime,
      endTime,
      day
    ).then((data) => {
      if (data.data.success) {
        setSuccessOpen(data.data.success);
      }
    });
  };

  const classes = useStyles();
  return (
    <>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          Meeting added successfully
        </Alert>
      </Snackbar>
      <form className={classes.content} onSubmit={submitForm}>
        <div className={classes.toolbar} />
        <h1 className="heading">Schedule a Meeting for teacher and student</h1>
        <div className="textgroup">
          <label htmlFor="teacher">Teacher: </label>
          <Autocomplete
            freeSolo
            onChange={(event, value) =>
              value &&
              setInputTeacher(
                value.split("(")[1].substring(0, value.split("(")[1].length - 1)
              )
            }
            options={teachers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher Name"
                margin="normal"
                variant="outlined"
                required
              />
            )}
          />
          <label htmlFor="student">Student: </label>
          <Autocomplete
            freeSolo
            onChange={(event, value) =>
              value &&
              setInputStudent(
                value.split("(")[1].substring(0, value.split("(")[1].length - 1)
              )
            }
            options={students}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Student Name"
                margin="normal"
                variant="outlined"
                required
              />
            )}
          />
        </div>

        <label htmlFor="student" className="date">
          Dates:{" "}
        </label>
        <div className="date-checkbox">
          <FormControlLabel
            control={
              <Checkbox
                checked={day.monday}
                onChange={handleChange}
                name="monday"
                color="primary"
              />
            }
            label="M"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={day.tuesday}
                onChange={handleChange}
                name="tuesday"
                color="primary"
              />
            }
            label="T"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={day.wednesday}
                onChange={handleChange}
                name="wednesday"
                color="primary"
              />
            }
            label="W"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={day.thursday}
                onChange={handleChange}
                name="thursday"
                color="primary"
              />
            }
            label="T"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={day.friday}
                onChange={handleChange}
                name="friday"
                color="primary"
              />
            }
            label="F"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={day.saturday}
                onChange={handleChange}
                name="saturday"
                color="primary"
              />
            }
            label="S"
          />
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>
            <KeyboardDatePicker
              className={classes.Startdate}
              margin="normal"
              id="start-date-picker-dialog"
              label="Start Date"
              format="MM/dd/yyyy"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <KeyboardDatePicker
              margin="normal"
              id="end-date-picker-dialog"
              label="End Date"
              format="MM/dd/yyyy"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>

          <div>
            <KeyboardTimePicker
              className={classes.Starttime}
              margin="normal"
              id="start-time-picker"
              label="StartTime"
              value={startTime}
              onChange={handleStartTimeChange}
            />

            <KeyboardTimePicker
              margin="normal"
              id="end-time-picker"
              label="End Time"
              value={endTime}
              onChange={handleEndTimeChange}

            />
          </div>
        </MuiPickersUtilsProvider>
        <div className={classes.saveButton}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default Admin;
