import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip";
import { getData } from "../../../Services/Services";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useParams } from "react-router-dom";

let days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const EditSchedule = () => {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [personName, setPersonName] = useState([]);
  const [teacher, setInputTeacher] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [demo, setDemo] = useState(false);
  const [radioday, setRadioday] = useState("");
  const [teacherName, setTeacherName] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlotState, setTimeSlotState] = useState([]);
  const [zoomEmail, setZoomEmail] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomAccounts, setZoomAccounts] = useState([]);
  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [prevTeacher, setPrevTeacher] = useState("");
  const [prevSlots, setPrevSlots] = useState([]);
  const [subjectNames, setSubjectNames] = useState("");
  const [subjectNameId, setSubjectNameId] = useState("");
  const { id } = useParams();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleDayChange = (event) => {
    setRadioday(event.target.value);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const getTimeSlots = async (teacher, prevTeacher) => {
    const timeSlotsData = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY`
    );
    console.log(timeSlotsData.data);
    console.log(teacher === prevTeacher);
    if (teacher === prevTeacher) {
      console.log(timeSlotsData.data.result, prevSlots);
      setAvailableTimeSlots(timeSlotsData.data.result.concat(prevSlots));
      setTimeSlotState(prevSlots);
    } else {
      setAvailableTimeSlots(timeSlotsData.data.result);
    }
  };

  // Serice calls
  useEffect(() => {
    getTeachers();
    getStudents();
    getZoomAccounts();
    getSubjectNames();
    getScheduleData();
  }, []);

  useEffect(() => {
    if (teacher && prevTeacher) {
      getTimeSlots(teacher, prevTeacher);
      setTimeSlotState([]);
    }
  }, [teacher, prevTeacher, prevSlots]);

  // Get teachers
  const getTeachers = async () => {
    const teacherNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
    );
    console.log(teacherNames.data);
    setTeacherName(teacherNames.data.result);
  };

  // Get Students
  const getStudents = async () => {
    const studentNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName`
    );
    console.log(studentNames);
    setStudentName(studentNames.data.result);
  };

  const getZoomAccounts = async () => {
    getData("Zoom Account")
      .then((data) => {
        setZoomAccounts(data.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScheduleData = async () => {
    try {
      const schedule = await Axios.get(
        `${process.env.REACT_APP_API_KEY}/schedule/${id}`
      );
      const {
        teacher,
        meetingLink,
        meetingAccount,
        demo,
        subject,
        startDate,
        students,
        slots: {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        },
      } = schedule.data.result;
      console.log(schedule.data.result);
      setInputTeacher(teacher);
      setPrevTeacher(teacher);
      setZoomLink(meetingLink);
      setZoomEmail(meetingAccount);
      setDemo(demo);
      setSubjectNameId(subject);
      setSelectedDate(startDate);
      setPersonName(
        students.map(
          (student) =>
            `${student.firstName} ${student.lastName}` +
            "!@#$%^&*($%^" +
            student._id
        )
      );
      setTimeSlotState([
        ...monday,
        ...tuesday,
        ...wednesday,
        ...thursday,
        ...friday,
        ...saturday,
        ...sunday,
      ]);
      setPrevSlots([
        ...monday,
        ...tuesday,
        ...wednesday,
        ...thursday,
        ...friday,
        ...saturday,
        ...sunday,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubjectNames = async () => {
    const subjectName = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/admin/get/Subject`
    );
    setSubjectNames(subjectName.data.result);
  };
  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
  };

  return (
    <>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSuccessClose} severity={alertColor}>
          {alert}
        </Alert>
      </Snackbar>

      <form onSubmit={submitForm}>
        <h1
          className="heading"
          style={{ fontSize: "20px", marginTop: "20px", textAlign: "center" }}
        >
          Edit the Schedule
        </h1>
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={false} md={4} />
          <Grid item xs={12} style={{ padding: "20px 50px" }} md={4}>
            <FormControl
              style={{
                width: "100%",
              }}
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="Select-subject-label">Select Teacher</InputLabel>
              <Select
                fullWidth
                labelId="Select-subject-label"
                id="select-subject"
                value={teacher}
                onChange={(e) => setInputTeacher(e.target.value)}
                label="Select Subject"
              >
                {teacherName &&
                  teacherName.map((teacher) => (
                    <MenuItem value={teacher.id}>
                      {teacher.TeacherName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} />
          <Grid item xs={12} md={4} />
          <Grid
            item
            xs={12}
            md={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {
                <AvailableTimeSlotChip
                  data={studentName}
                  state={personName}
                  setState={setPersonName}
                  valueFinder={(item) => item._id}
                  labelFinder={(item) => `${item.firstName} ${item.lastName}`}
                />
              }
            </div>
          </Grid>

          <Grid item xs={12} md={4} />
        </Grid>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="date-checkbox">
            <FormControl component="fieldset" style={{ marginTop: "50px" }}>
              <FormLabel component="legend" style={{ textAlign: "center" }}>
                Dates
              </FormLabel>
              <RadioGroup
                color="primary"
                aria-label="Dates"
                name="gender1"
                value={radioday}
                onChange={handleDayChange}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {days.map((day) => (
                  <FormControlLabel
                    value={day}
                    control={<Radio color="primary" />}
                    label={day.slice(0, 3)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {
              <AvailableTimeSlotChip
                data={
                  availableTimeSlots.filter((slot) =>
                    slot.startsWith(radioday)
                  ) || []
                }
                state={timeSlotState}
                setState={setTimeSlotState}
                timeSlots
                valueFinder={(item) => item}
                labelFinder={(item) => item}
              />
            }
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="MM-dd-yyyy"
                margin="normal"
                label="Start Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <FormControl
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="Select-subject-label">Select Subject</InputLabel>
              <Select
                fullWidth
                labelId="Select-subject-label"
                id="select-subject"
                value={subjectNameId}
                onChange={(e) => setSubjectNameId(e.target.value)}
                label="Select Subject"
              >
                {subjectNames &&
                  subjectNames.map((subject) => (
                    <MenuItem value={subject._id}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="Select-label">Select Zoom Account</InputLabel>
              <Select
                fullWidth
                labelId="Select-label"
                id="demo-simple-select-outlined"
                value={zoomEmail}
                onChange={(e) => setZoomEmail(e.target.value)}
                label="Select Zoom Account"
              >
                {zoomAccounts.map((account) => (
                  <MenuItem value={account._id}>
                    {account.ZoomAccountName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Zoom Link"
              variant="outlined"
              value={zoomLink}
              required
              onChange={(e) => setZoomLink(e.target.value)}
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
                  checked={demo}
                  onChange={(event) => setDemo(event.target.checked)}
                  name="Demo"
                  color="primary"
                />
              }
              label="DEMO"
            />
          </div>
          <div className={classes.saveButton}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSchedule;
