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
  Switch,
  IconButton,
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
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { firebase } from "../../../Firebase";
import useDocumentTitle from "../../../Components/useDocumentTitle";

const isImageUrl = require("is-image-url");
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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
  useDocumentTitle("Edit Schedule");

  const classes = useStyles();
  let query = useQuery();
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
  const [ClassName, setClassName] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isMeetingLinkChangeNeeded, setIsMeetingLinkChangeNeeded] =
    useState(false);
  const [oneToOne, setOneToOne] = useState(true);
  const [isZoomMeeting, setIsZoomMeeting] = useState(true);
  const [isSummerCampClass, setIsSummerCampClass] = useState(false);
  const [summerCampAmount, setSummerCampAmount] = useState(0);
  const [summerCampTitle, setSummerCampTitle] = useState("");
  const [summerCampDescription, setSummerCampDescription] = useState("");
  const [summerCampSchedule, setSummerCampSchedule] = useState(
    EditorState.createEmpty()
  );
  const [summerCampImage, setSummerCampImage] = useState();
  const [summerCampStudentsLimit, setSummerCampStudentsLimit] = useState(0);
  const [summerCampClassNumberOfDays, setSummerCampClassNumberOfDays] =
    useState(0);
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
    if (teacher === prevTeacher) {
      setAvailableTimeSlots(timeSlotsData.data.result.concat(prevSlots));
      setTimeSlotState(prevSlots);
    } else {
      setAvailableTimeSlots(timeSlotsData.data.result);
    }
  };

  // Service calls
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

  const getTeachers = async () => {
    const teacherNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
    );
    setTeacherName(teacherNames.data.result);
  };

  const getStudents = async () => {
    const studentNames = await Axios.get(
      `${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName`
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

  const getScheduleData = async () => {
    try {
      const schedule = await Axios.get(
        `${process.env.REACT_APP_API_KEY}/schedule/${id}`
      );
      const {
        teacher,
        className,
        meetingLink,
        meetingAccount,
        demo,
        OneToOne,
        subject,
        startDate,
        students,
        isSummerCampClass,
        summerCampAmount,
        isZoomMeeting: zoomMeetingOrNot,
        summerCampTitle,
        summerCampDescription,
        summerCampSchedule,
        summerCampImage,
        summerCampStudentsLimit,
        summerCampClassNumberOfDays,
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
      if (summerCampSchedule) {
        const contentBlock = htmlToDraft(summerCampSchedule);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorStateValue = EditorState.createWithContent(contentState);
          setSummerCampSchedule(editorStateValue);
        }
      }
      setInputTeacher(teacher);
      setClassName(className);
      setPrevTeacher(teacher);
      setZoomLink(meetingLink || "");
      setZoomEmail(meetingAccount || "");
      setDemo(demo);
      setOneToOne(OneToOne);
      setIsSummerCampClass(isSummerCampClass);
      setSummerCampAmount(summerCampAmount);
      setSummerCampImage(summerCampImage);
      setSummerCampDescription(summerCampDescription);
      setSummerCampTitle(summerCampTitle);
      setSummerCampStudentsLimit(summerCampStudentsLimit);
      setIsZoomMeeting(zoomMeetingOrNot);
      setSubjectNameId(subject || "");
      setSummerCampClassNumberOfDays(summerCampClassNumberOfDays);
      setSelectedDate(
        startDate
          ? `${startDate.split("-")[1]}-${startDate.split("-")[0]}-${
              startDate.split("-")[2]
            }`
          : new Date()
      );
      setPersonName(students);
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

  const submitForm = async (e) => {
    e.preventDefault();
    if (!!timeSlotState.length) {
      setLoading(true);
      let formData = {
        slots: {},
      };
      days.forEach((day) => {
        formData["slots"][day.toLowerCase()] = timeSlotState
          .filter((slot) => slot.startsWith(day))
          .map((slot) => slot.split("!@#$%^&*($%^")[0]);
      });
      if (!teacher) {
        setAlertColor("error");
        setSuccessOpen(true);
        setAlert("Please Select a Teacher");
        setLoading(false);
        return;
      }
      let url = summerCampImage;
      if (isSummerCampClass && typeof summerCampImage !== "string") {
        let storageRef = firebase
          .storage()
          .ref(`${summerCampImage[0].type}/${summerCampImage[0].name}`);
        await storageRef.put(summerCampImage[0]);
        url = await storageRef.getDownloadURL();
        formData = {
          ...formData,
          className: ClassName,
          meetingLink: zoomLink,
          meetingAccount: zoomEmail,
          teacher: teacher,
          students: personName.map((student) => student._id),
          demo: demo,
          OneToOne: oneToOne,
          oneToMany: !oneToOne,
          subject: subjectNameId,
          startDate: moment(selectedDate).format("DD-MM-YYYY"),
          isMeetingLinkChangeNeeded,
          isZoomMeeting,
          summerCampAmount,
          isSummerCampClass,
          summerCampTitle,
          summerCampDescription,
          summerCampSchedule: draftToHtml(
            convertToRaw(summerCampSchedule.getCurrentContent())
          ),
          summerCampImage: url,
          summerCampStudentsLimit,
          summerCampClassNumberOfDays,
        };
        try {
          const res = await Axios.post(
            `${process.env.REACT_APP_API_KEY}/schedule/edit/${id}`,
            formData
          );
          setDemo(false);
          setPersonName([]);
          setZoomEmail("");
          setZoomLink("");
          setSubjectNameId("");
          setSuccessOpen(true);
          setAlert(res.data.message);
          setAlertColor("success");
          setLoading(false);
          setRadioday("");
          setClassName("");
          setTimeSlotState([]);
          setIsZoomMeeting("");
          setOneToOne("");
          setTimeout(() => {
            setRedirect(true);
          }, 2000);
        } catch (error) {
          console.error(error.response);
          if (error.response) {
            setSuccessOpen(true);
            setAlert(error.response.data.error);
            setAlertColor("error");
            setLoading(false);
          }
        }
      } else {
        formData = {
          ...formData,
          className: ClassName,
          meetingLink: zoomLink,
          meetingAccount: zoomEmail,
          teacher: teacher,
          students: personName.map((student) => student._id),
          demo: demo,
          OneToOne: oneToOne,
          oneToMany: !oneToOne,
          subject: subjectNameId,
          startDate: moment(selectedDate).format("DD-MM-YYYY"),
          isMeetingLinkChangeNeeded,
          isZoomMeeting,
          summerCampAmount,
          isSummerCampClass,
          summerCampTitle,
          summerCampDescription,
          summerCampSchedule: draftToHtml(
            convertToRaw(summerCampSchedule.getCurrentContent())
          ),
          summerCampImage: url,
          summerCampStudentsLimit,
          summerCampClassNumberOfDays,
        };
        try {
          const res = await Axios.post(
            `${process.env.REACT_APP_API_KEY}/schedule/edit/${id}`,
            formData
          );
          setDemo(false);
          setPersonName([]);
          setZoomEmail("");
          setZoomLink("");
          setSubjectNameId("");
          setSuccessOpen(true);
          setAlert(res.data.message);
          setAlertColor("success");
          setLoading(false);
          setRadioday("");
          setClassName("");
          setTimeSlotState([]);
          setIsZoomMeeting("");
          setOneToOne("");
          setTimeout(() => {
            setRedirect(true);
          }, 2000);
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
    } else {
      setAlertColor("error");
      setSuccessOpen(true);
      setAlert("Please Select TimeSlots");
    }
  };

  if (redirect) {
    return (
      <Redirect to={query.get("goto") ? query.get("goto") : "/scheduler"} />
    );
  }

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
                width: "100%",
                margin: "0 20px",
              }}
            >
              <Autocomplete
                filterSelectedOptions
                options={studentName}
                getOptionSelected={(option, value) => option._id === value._id}
                getOptionLabel={(option) =>
                  `${option.firstName ? option.firstName : ""} ${
                    option.lastName ? option.lastName : ""
                  }`
                }
                multiple
                onChange={(e, v) => setPersonName(v)}
                value={personName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ width: "100%" }}
                    label="Students"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
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
                format="dd-MM-yyyy"
                margin="normal"
                label="Start Date"
                value={selectedDate}
                onChange={handleDateChange}
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
              label="ClassName"
              variant="outlined"
              value={ClassName}
              required
              onChange={(e) => setClassName(e.target.value)}
              style={{
                maxWidth: "400px",
                minWidth: "300px",
                marginTop: "10px",
              }}
            />
            {/* <ToggleButtonGroup
							value={isZoomMeeting}
							exclusive
							style={{
								margin: '20px 0',
							}}
							onChange={(e, v) => setIsZoomMeeting(v)}
							aria-label="Zoom meeting or not"
						>
							<ToggleButton value={true} aria-label="left aligned">
								<img
									style={{ width: '30px', height: '30px' }}
									src={require('../../../Images/ZOOM LOGO.png')}
								/>
							</ToggleButton>
							<ToggleButton value={false} aria-label="centered">
								<img
									style={{ width: '30px', height: '30px' }}
									src={require('../../../Images/whereby.png')}
								/>
							</ToggleButton>
						</ToggleButtonGroup> */}
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                onChange={() => setOneToOne((prev) => !prev)}
                name="position"
                value={oneToOne}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio color="primary" />}
                  label="One to One"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio color="primary" />}
                  label="One to Many"
                />
              </RadioGroup>
            </FormControl>
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
          <FormControlLabel
            style={{ marginTop: "20px" }}
            control={
              <Checkbox
                checked={isSummerCampClass}
                onChange={(event) => setIsSummerCampClass(event.target.checked)}
                name="Demo"
                color="primary"
              />
            }
            label="Summer Camp Class"
          />
          {isSummerCampClass ? (
            <>
              <div
                style={{
                  maxWidth: "450px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              >
                <FormControl
                  variant="outlined"
                  style={{
                    width: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    style={{
                      margin: "10px 0",
                    }}
                    type={"number"}
                    id="outlined-basic"
                    label="Summer Camp Class Amount"
                    variant="outlined"
                    value={summerCampAmount}
                    onChange={(e) => setSummerCampAmount(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{
                    width: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    style={{
                      margin: "10px 0",
                    }}
                    type={"number"}
                    id="outlined-basic"
                    label="Summer Camp Students Limit"
                    variant="outlined"
                    value={summerCampStudentsLimit}
                    onChange={(e) => setSummerCampStudentsLimit(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{
                    width: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    style={{
                      margin: "10px 0",
                    }}
                    type={"number"}
                    id="outlined-basic"
                    label="Summer Camp Days"
                    variant="outlined"
                    value={summerCampClassNumberOfDays}
                    onChange={(e) =>
                      setSummerCampClassNumberOfDays(e.target.value)
                    }
                  />
                </FormControl>
                <TextField
                  style={{
                    margin: "10px 0",
                  }}
                  id="title"
                  fullWidth
                  label="Summer Camp Class Title"
                  value={summerCampTitle}
                  onChange={(e) => setSummerCampTitle(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
                <TextField
                  style={{
                    margin: "10px 0",
                  }}
                  id="desc"
                  fullWidth
                  label="Summer Camp Class Description"
                  value={summerCampDescription}
                  onChange={(e) => setSummerCampDescription(e.target.value)}
                  multiline
                  rows={8}
                  variant="outlined"
                />

                <FormControl
                  variant="outlined"
                  style={{
                    width: "100%",
                  }}
                >
                  {typeof summerCampImage === "string" ? (
                    <img
                      src={summerCampImage}
                      alt=""
                      style={{
                        width: "100%",
                        margin: "20px 0",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div
                    style={{
                      minHeight: "250px",
                      backgroundColor: "#F5F5F5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {summerCampImage &&
                    summerCampImage.length > 0 === true &&
                    typeof summerCampImage !== "string" ? (
                      <img
                        src={URL.createObjectURL(summerCampImage[0])}
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <>
                        <IconButton variant="contained" component="label">
                          <i
                            style={{
                              color: "#C4C4C4",
                              fontSize: 30,
                              marginBottom: 5,
                            }}
                            class="fa fa-camera"
                          ></i>
                          <input
                            multiple
                            accept="image/x-png,image/jpeg"
                            onChange={(e) => setSummerCampImage(e.target.files)}
                            type="file"
                            hidden
                          />
                        </IconButton>
                        <p style={{ color: "#C4C4C4", fontWeight: "bold" }}>
                          Choose an Image to Update existing Image
                        </p>
                      </>
                    )}
                  </div>
                  <p
                    style={{
                      color: "red",
                      marginBottom: 20,
                      cursor: "pointer",
                      marginTop: 20,
                    }}
                    onClick={() => setSummerCampImage()}
                  >
                    <i className="fas fa-times-circle"></i> Delete Image
                  </p>
                </FormControl>
              </div>
              {summerCampSchedule && summerCampSchedule.getImmutable ? (
                <div
                  style={{
                    width: "90vw",
                    minHeight: "400px",
                    margin: "auto",
                    border: "2px solid grey",
                    borderRadius: "5px",
                  }}
                >
                  <Editor
                    editorState={summerCampSchedule}
                    onEditorStateChange={(e) => {
                      setSummerCampSchedule(e);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          <FormControlLabel
            control={
              <Switch
                checked={isMeetingLinkChangeNeeded}
                onChange={() => setIsMeetingLinkChangeNeeded((prev) => !prev)}
                name="checkedA"
              />
            }
            label="Create new Meeting Link"
          />

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
