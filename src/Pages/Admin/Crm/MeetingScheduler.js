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

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip";
import { getData } from "../../../Services/Services";

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

const MeetingScheduler = () => {
  const classes = useStyles();
  const [personName, setPersonName] = useState([]);
  const [teacher, setInputTeacher] = useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [demo, setDemo] = useState(false);
  const [radioday, setRadioday] = useState("");
  const [teacherName, setTeacherName] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlotState, setTimeSlotState] = useState([]);
  const [zoomEmail, setZoomEmail] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomAccounts, setZoomAccounts] = useState([]);
  const [teacherNameFullObject, setTeacherNameFullObject] = useState({});
  const [studentNamesFullObject, setStudentNamesFullObject] = useState([]);
  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);

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
    console.log(timeSlotsData.data);
    setAvailableTimeSlots(timeSlotsData.data.result);
  };

  // Serice calls
  useEffect(() => {
    getTeachers();
    getStudents();
    getZoomAccounts();
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
  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    let formData = {};
    days.forEach((day) => {
      formData[day.toLowerCase()] = timeSlotState.filter((slot) =>
        slot.startsWith(day)
      );
    });
    formData = {
      ...formData,
      meetingLink: zoomLink,
      meetingAccount: zoomEmail,
      teacher: teacher,
      students: personName,
      demo: demo,
    };
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_API_KEY}/schedule`,
        formData
      );
      setDemo(false);
      setPersonName("");
      setZoomEmail("");
      setZoomLink("");
      setPersonName("");
      setSuccessOpen(true);
      setAlert(res.data.message);
      setAlertColor("success");
      setLoading(false);
      setTeacherNameFullObject({});
      setStudentNamesFullObject([]);
      setRadioday("");
      setTimeSlotState([]);
    } catch (error) {
      console.error(error.response);
      if (error.response) {
        setSuccessOpen(true);
        setAlert(error.response.data.error);
        setAlertColor("error");
        setLoading(false);
      }
    }
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
          Schedule A Meeting
        </h1>
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={false} md={4} />
          <Grid item xs={12} md={4}>
            {teacherName.length ? (
              <Autocomplete
                style={{ width: "60%", margin: "0 auto" }}
                options={teacherName}
                value={teacherNameFullObject}
                getOptionLabel={(option) => option.TeacherName}
                onChange={(event, value) => {
                  value && setInputTeacher(value.id);
                  value && setTeacherNameFullObject(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Teachers"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                )}
              />
            ) : (
              ""
            )}{" "}
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
                style={{ width: "60%", margin: "0 auto" }}
                options={studentName}
                value={studentNamesFullObject}
                getOptionLabel={(name) => `${name.firstName} ${name.lastName}`}
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
                timeSlotState={timeSlotState}
                setTimeSlotState={setTimeSlotState}
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
                  name="friday"
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

export default MeetingScheduler;
