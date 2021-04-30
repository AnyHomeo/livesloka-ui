/* eslint-disable react-hooks/exhaustive-deps */
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
import LinkIcon from "@material-ui/icons/Link";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip";
import { getData } from "../../../Services/Services";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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

const AvailableMeetingSchedule = ({ match }) => {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [personName, setPersonName] = useState([]);
  const [teacher, setInputTeacher] = useState(match.params.teacher);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [demo, setDemo] = useState(false);
  const [onetoone, setonetoone] = useState(false);
  const [onetomany, setonetomany] = useState(false);
  const [radioday, setRadioday] = useState("");
  const [teacherName, setTeacherName] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlotState, setTimeSlotState] = useState([]);
  const [zoomEmail, setZoomEmail] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomAccounts, setZoomAccounts] = useState([]);
  const [teacherNameFullObject, setTeacherNameFullObject] = useState({
    id: "",
    TeacherName: "",
  });
  const [studentNamesFullObject, setStudentNamesFullObject] = useState([]);
  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);

  const [subjectNames, setSubjectNames] = useState("");
  const [subjectNameId, setSubjectNameId] = useState("");
  const [className, setClassName] = useState("");

  const handleDayChange = (event) => {
    setRadioday(event.target.value);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const getTimeSlots = async () => {
    const timeSlotsData = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY`
    );
    setAvailableTimeSlots(timeSlotsData.data.result);
  };

  // Serice calls
  useEffect(() => {
    getTeachers();
    getStudents();
    getZoomAccounts();
    getSubjectNames();
  }, []);

  useEffect(() => {
    if (teacher) {
      getTimeSlots();
      setTimeSlotState([]);
    }
  }, [teacher]);

  // Get teachers
  const getTeachers = async () => {
    const teacherNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
    );
    setTeacherName(teacherNames.data.result);
  };

  // Get Students
  const getStudents = async () => {
    const studentNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName,subjectId`
    );
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

  const getSubjectNames = async () => {
    const subjectName = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/admin/get/Subject`
    );
    setSubjectNames(subjectName.data.result);
  };

  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    let formData = {};

    days.forEach((day) => {
      formData[day.toLowerCase()] = timeSlotState
        .filter((slot) => slot.startsWith(day))
        .map((slot) => slot.split("!@#$%^&*($%^")[0]);
    });

    let newZoomLink = "";
    let newZoomJwt = "";
    try {
      const getZoomLink = await Axios.post(
        `${process.env.REACT_APP_API_KEY}/link/getzoomlink`,

        timeSlotState
      );
      newZoomLink = getZoomLink.data.result.link;
      newZoomJwt = getZoomLink.data.result.id;

      if (getZoomLink.status === 200) {
        formData = {
          ...formData,
          meetingLink: newZoomLink,
          meetingAccount: newZoomJwt,
          teacher: teacher,
          students: personName,
          demo: demo,
          OneToOne: onetoone,
          OneToMany: onetomany,
          subject: subjectNameId,
          startDate: moment(selectedDate).format("DD-MM-YYYY"),
          classname: className,
          Jwtid: newZoomJwt,
          timeSlotState,
        };
        try {
          const res = await Axios.post(
            `${process.env.REACT_APP_API_KEY}/schedule`,
            formData
          );
          setDemo(false);
          setonetoone(false);
          setonetomany(false);
          setPersonName("");
          setZoomLink("");
          setPersonName("");
          setSubjectNameId("");
          setSuccessOpen(true);
          setAlert(res.data.message);
          setAlertColor("success");
          setLoading(false);
          setTeacherNameFullObject({});
          setStudentNamesFullObject([]);
          setRadioday("");
          setClassName("");
          setTimeSlotState([]);
          setAvailableTimeSlots([]);
        } catch (error) {
          console.error(error.response);
          if (error.response) {
            setSuccessOpen(true);
            setAlert(error.response.data.error);
            setAlertColor("error");
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.log(error.response);
      setSuccessOpen(true);
      setAlert(error.response.data.message);
      setAlertColor("error");
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeSlotState(match.params.slot.split(","));
  }, []);

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
          Schedule A Meeting
        </h1>
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={false} md={4} />
          <Grid item xs={12} md={4}>
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
            {studentName.length && studentName[0].firstName ? (
              <Autocomplete
                multiple
                style={{ width: "100%", margin: "0 auto" }}
                options={studentName}
                value={studentNamesFullObject}
                getOptionLabel={(name) =>
                  `${name.firstName} ${name.lastName ? name.lastName : ""}${
                    name.subject ? `(${name.subject.subjectName})` : ""
                  }`
                }
                onChange={(event, value) => {
                  let tempData = [];
                  setStudentNamesFullObject(value);
                  value &&
                    value.forEach((val) => {
                      tempData.push(val._id);
                      setPersonName(tempData);
                    });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Students"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            ) : (
              ""
            )}
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
                valueFinder={(item) => item}
                labelFinder={(item) => item}
                state={timeSlotState}
                setState={setTimeSlotState}
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
                disableToolbar
                variant="inline"
                format="dd-MM-yyyy"
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
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Class Name "
                variant="outlined"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{
                  maxWidth: "400px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              />
            </FormControl>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                style={{ marginTop: "20px" }}
                control={
                  <Checkbox
                    checked={onetoone}
                    onChange={(event) => setonetoone(event.target.checked)}
                    name="OneToOne"
                    color="primary"
                  />
                }
                label="One to one ?"
              />
              <FormControlLabel
                style={{ marginTop: "20px" }}
                control={
                  <Checkbox
                    checked={onetomany}
                    onChange={(event) => setonetomany(event.target.checked)}
                    name="OneToMany"
                    color="primary"
                  />
                }
                label="One to many ?"
              />
            </div>
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
                Save
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default AvailableMeetingSchedule;
