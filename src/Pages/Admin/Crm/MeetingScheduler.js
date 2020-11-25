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
  Grid,
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
  Startdate: {
    marginRight: "10px",
  },
  Starttime: {
    marginRight: "10px",
  },
}));
const MeetingScheduler = () => {
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
    console.log(teacher, student, startDate, endDate, startTime, endTime, day);
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
        console.log(data.data.success);
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
      <form onSubmit={submitForm}>
        <h1
          className="heading"
          style={{ fontSize: "20px", marginTop: "20px", textAlign: "center" }}
        >
          Schedule A Meeting
        </h1>
        <Grid container style={{ width: "100vw" }}>
          <Grid item xs={false} md={4} />
          <Grid item xs={12} md={4}>
            <Autocomplete
              fullWidth
              onChange={(event, value) =>
                value &&
                setInputTeacher(
                  value
                    .split("(")[1]
                    .substring(0, value.split("(")[1].length - 1)
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
          </Grid>
          <Grid item xs={12} md={4} />
          <Grid item xs={12} md={4} />
          <Grid item xs={12} md={4}>
            <Autocomplete
              fullWidth
              onChange={(event, value) => value && setInputStudent(value)}
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
          </Grid>
          <Grid item xs={12} md={4} />
        </Grid>
        <h1 style={{ textAlign: "center" }}>Dates: </h1>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                id="end-date-picker-dialog"
                label="End Date"
                format="MM/dd/yyyy"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
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
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />

              <KeyboardTimePicker
                margin="normal"
                id="end-time-picker"
                label="End Time"
                value={endTime}
                onChange={handleEndTimeChange}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </div>
          </MuiPickersUtilsProvider>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Zoom Account"
              variant="outlined"
              fullWidth
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
            />

            <TextField
              id="outlined-basic"
              label="Zoom Link"
              variant="outlined"
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
            />

            <FormControlLabel
              style={{ marginTop: "20px" }}
              control={
                <Checkbox
                  checked={day.friday}
                  onChange={handleChange}
                  name="friday"
                  color="primary"
                />
              }
              label="DEMO"
            />
          </div>

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
        </div>
      </form>
    </>
  );
};

export default MeetingScheduler;
