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
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip";

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
  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const [personName, setPersonName] = useState();

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
  const [demo, setDemo] = useState(false);
  const [radioday, setRadioday] = useState("");

  const handleDayChange = (event) => {
    setRadioday(event.target.value);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  // Serice calls

  const [teacherName, setTeacherName] = useState();
  const [studentName, setStudentName] = useState();
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [mondayData, setMondayData] = useState([]);
  const [tuesdayData, setTuesdayData] = useState([]);
  const [wednesdayData, setWednesdayData] = useState([]);
  const [thursdayData, setThursdayData] = useState([]);
  const [fridayData, setFridayData] = useState([]);
  const [saturdayData, setSaturdayData] = useState([]);
  const [sundayData, setSundayData] = useState([]);

  const [timeSlotState, setTimeSlotState] = useState();

  const [zoomEmail, setZoomEmail] = useState("");
  const [zoomLink, setZoomLink] = useState("");

  useEffect(() => {
    getTeachers();
    getStudents();
  }, []);

  useEffect(() => {
    if (teacher) {
      getTimeSlots();
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
      `${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName`
    );
    setStudentName(studentNames.data.result);
  };

  const getTimeSlots = async () => {
    const timeSlotsData = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY`
    );
    setAvailableTimeSlots(timeSlotsData.data.result);

    let MonSlotData = [];
    let TuesSlotData = [];
    let WedSlotData = [];
    let ThurSlotData = [];
    let FrilotData = [];
    let SatSlotData = [];
    let SunSlotData = [];

    timeSlotsData &&
      timeSlotsData.data.result.forEach((timeslot) => {
        if (timeslot.startsWith("MONDAY")) {
          MonSlotData.push(timeslot);
          setMondayData(MonSlotData);
        }
        if (timeslot.startsWith("TUESDAY")) {
          TuesSlotData.push(timeslot);
          setTuesdayData(TuesSlotData);
        }
        if (timeslot.startsWith("WEDNESDAY")) {
          WedSlotData.push(timeslot);
          setWednesdayData(WedSlotData);
        }
        if (timeslot.startsWith("THURSDAY")) {
          ThurSlotData.push(timeslot);
          setThursdayData(ThurSlotData);
        }
        if (timeslot.startsWith("FRIDAY")) {
          FrilotData.push(timeslot);
          setFridayData(FrilotData);
        }
        if (timeslot.startsWith("SATURDAY")) {
          SatSlotData.push(timeslot);
          setSaturdayData(SatSlotData);
        }
        if (timeslot.startsWith("SUNDAY")) {
          SunSlotData.push(timeslot);
          setSundayData(SunSlotData);
        }
      });
  };

  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);
  const submitForm = async (e) => {
    e.preventDefault();

    let MonSlotData = [];
    let TuesSlotData = [];
    let WedSlotData = [];
    let ThurSlotData = [];
    let FrilotData = [];
    let SatSlotData = [];
    let SunSlotData = [];

    timeSlotState.forEach((timeslot) => {
      if (timeslot.startsWith("MONDAY")) {
        MonSlotData.push(timeslot);
      }
      if (timeslot.startsWith("TUESDAY")) {
        TuesSlotData.push(timeslot);
      }
      if (timeslot.startsWith("WEDNESDAY")) {
        WedSlotData.push(timeslot);
      }
      if (timeslot.startsWith("THURSDAY")) {
        ThurSlotData.push(timeslot);
      }
      if (timeslot.startsWith("FRIDAY")) {
        FrilotData.push(timeslot);
      }
      if (timeslot.startsWith("SATURDAY")) {
        SatSlotData.push(timeslot);
      }
      if (timeslot.startsWith("SUNDAY")) {
        SunSlotData.push(timeslot);
      }
    });

    const formData = {
      monday: MonSlotData,
      tuesday: TuesSlotData,
      wednesday: WedSlotData,
      thursday: ThurSlotData,
      friday: FrilotData,
      saturday: SatSlotData,
      sunday: SunSlotData,
      meetingLink: zoomLink,
      meetingAccount: zoomEmail,
      teacher: teacher,
      students: personName,
      demo: demo,
    };
    setDemo(false);
    setPersonName("");
    setZoomEmail("");
    setZoomLink("");
    setPersonName("");

    setLoading(true);
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_API_KEY}/schedule`,
        formData
      );
      setSuccessOpen(true);
      setAlert(res.data.message);
      setAlertColor("success");
    } catch (error) {
      console.error(error.response);
      if (error.response) {
        setSuccessOpen(true);
        setAlert(error.response.data.message);
        setAlertColor("error");
      }
    }

    setLoading(false);
  };

  const getPropData = (val) => {
    setTimeSlotState(val);
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
            {teacherName && (
              <Autocomplete
                style={{ width: "60%", margin: "0 auto" }}
                options={teacherName}
                getOptionLabel={(option) => option.TeacherName}
                onChange={(event, value) => value && setInputTeacher(value.id)}
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
            )}
          </Grid>
          <Grid item xs={12} md={4} />
          <Grid item xs={12} md={4} />
          <Grid
            item
            xs={12}
            md={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {studentName && (
              <Autocomplete
                multiple
                style={{ width: "60%", margin: "0 auto" }}
                options={studentName}
                getOptionLabel={(name) => `${name.firstName} ${name.lastName}`}
                onChange={(event, value) => {
                  let tempData = [];
                  value &&
                    value.map((val) => {
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
              <FormLabel component="legend">Dates</FormLabel>
              <RadioGroup
                color="primary"
                aria-label="Dates"
                name="gender1"
                value={radioday}
                onChange={handleDayChange}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel
                  value="MONDAY"
                  control={<Radio color="primary" />}
                  label="M"
                />
                <FormControlLabel
                  value="TUESDAY"
                  control={<Radio color="primary" />}
                  label="T"
                />
                <FormControlLabel
                  value="WEDNESDAY"
                  control={<Radio color="primary" />}
                  label="W"
                />
                <FormControlLabel
                  value="THURSDAY"
                  control={<Radio color="primary" />}
                  label="T"
                />
                <FormControlLabel
                  value="FRIDAY"
                  control={<Radio color="primary" />}
                  label="F"
                />
                <FormControlLabel
                  value="SATURDAY"
                  control={<Radio color="primary" />}
                  label="S"
                />
                <FormControlLabel
                  value="SUNDAY"
                  control={<Radio color="primary" />}
                  label="S"
                />
              </RadioGroup>
            </FormControl>
            {console.log(radioday)}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {radioday === "MONDAY" ? (
              <AvailableTimeSlotChip
                data={mondayData}
                getPropData={getPropData}
              />
            ) : radioday === "TUESDAY" ? (
              <AvailableTimeSlotChip
                data={tuesdayData}
                getPropData={getPropData}
              />
            ) : radioday === "WEDNESDAY" ? (
              <AvailableTimeSlotChip
                data={wednesdayData}
                getPropData={getPropData}
              />
            ) : radioday === "THURSDAY" ? (
              <AvailableTimeSlotChip
                data={thursdayData}
                getPropData={getPropData}
              />
            ) : radioday === "FRIDAY" ? (
              <AvailableTimeSlotChip
                data={fridayData}
                getPropData={getPropData}
              />
            ) : radioday === "SATURDAY" ? (
              <AvailableTimeSlotChip
                data={saturdayData}
                getPropData={getPropData}
              />
            ) : radioday === "SUNDAY" ? (
              <AvailableTimeSlotChip
                data={sundayData}
                getPropData={getPropData}
              />
            ) : (
              <AvailableTimeSlotChip />
            )}

            <TextField
              id="outlined-basic"
              label="Zoom Account"
              variant="outlined"
              fullWidth
              onChange={(e) => setZoomEmail(e.target.value)}
              value={zoomEmail}
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
            />

            <TextField
              fullWidth
              id="outlined-basic"
              label="Zoom Link"
              variant="outlined"
              value={zoomLink}
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
