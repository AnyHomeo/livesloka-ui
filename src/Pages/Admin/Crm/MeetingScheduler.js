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
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getAllTeachers,
  getAllStudents,
  postMeeting,
} from "../../../Services/Services";
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MeetingScheduler = () => {
  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [personName, setPersonName] = useState();

  console.log(personName);

  const [day, setDay] = useState({
    MONDAY: false,
    TUESDAY: false,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
    SUNDAY: false,
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
  const [demo, setDemo] = useState(false);
  const [radioday, setRadioday] = useState("");

  const handleDayChange = (event) => {
    setRadioday(event.target.value);
  };

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
    console.log(timeSlotsData.data);

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

    console.log(formData);
    setLoading(true);
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_API_KEY}/schedule`,
        formData
      );
      console.log(res);
      setSuccessOpen(true);
      setAlert(res.data.message);
      setAlertColor("success");
    } catch (error) {
      console.log(error.response);
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
            {/* <FormControl className={classes.formControl}>
              <InputLabel id="demo-mutiple-chip-label">Students</InputLabel>
              <Select
                style={{ width: "300px" }}
                variant="outlined"
                multiple
                value={personName}
                onChange={handleChipChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {studentName &&
                  studentName.map((name) => (
                    <MenuItem
                      key={name._id}
                      value={`${name.firstName} ${name.lastName}`}
                      // value={name._id}
                      style={getStyles(name, personName, theme)}
                    >
                      {name.firstName} {name.lastName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl> */}
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
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={day.monday}
                  onChange={handleChange}
                  name="MONDAY"
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
                  name="TUESDAY"
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
                  name="WEDNESDAY"
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
                  name="THURSDAY"
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
                  name="FRIDAY"
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
                  name="SATURDAY"
                  color="primary"
                />
              }
              label="S"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={day.sunday}
                  onChange={handleChange}
                  name="SUNDAY"
                  color="primary"
                />
              }
              label="S"
            /> */}

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
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
          </MuiPickersUtilsProvider> */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              // width: "100%",
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
