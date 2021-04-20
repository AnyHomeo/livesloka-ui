import React, { useEffect, useState } from "react";
import "./scheduler.css";
import OccupancyBars from "./OccupancyBars";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import {
  addAvailableTimeSlot,
  deleteAvailableTimeSlot,
  getOccupancy,
  updateScheduleDangerously,
} from "../../../Services/Services";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Slide,
  Switch,
  TextField,
  Snackbar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { FileCopyOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Axios from "axios";
import SingleBlock from "./SingleBlock";
import MuiAlert from "@material-ui/lab/Alert";
import AdjustIcon from "@material-ui/icons/Adjust";
const times = [
  "12:00 AM-12:30 AM",
  "12:30 AM-01:00 AM",
  "01:00 AM-01:30 AM",
  "01:30 AM-02:00 AM",
  "02:00 AM-02:30 AM",
  "02:30 AM-03:00 AM",
  "03:00 AM-03:30 AM",
  "03:30 AM-04:00 AM",
  "04:00 AM-04:30 AM",
  "04:30 AM-05:00 AM",
  "05:00 AM-05:30 AM",
  "05:30 AM-06:00 AM",
  "06:00 AM-06:30 AM",
  "06:30 AM-07:00 AM",
  "07:00 AM-07:30 AM",
  "07:30 AM-08:00 AM",
  "08:00 AM-08:30 AM",
  "08:30 AM-09:00 AM",
  "09:00 AM-09:30 AM",
  "09:30 AM-10:00 AM",
  "10:00 AM-10:30 AM",
  "10:30 AM-11:00 AM",
  "11:00 AM-11:30 AM",
  "11:30 AM-12:00 PM",
  "12:00 PM-12:30 PM",
  "12:30 PM-01:00 PM",
  "01:00 PM-01:30 PM",
  "01:30 PM-02:00 PM",
  "02:00 PM-02:30 PM",
  "02:30 PM-03:00 PM",
  "03:00 PM-03:30 PM",
  "03:30 PM-04:00 PM",
  "04:00 PM-04:30 PM",
  "04:30 PM-05:00 PM",
  "05:00 PM-05:30 PM",
  "05:30 PM-06:00 PM",
  "06:00 PM-06:30 PM",
  "06:30 PM-07:00 PM",
  "07:00 PM-07:30 PM",
  "07:30 PM-08:00 PM",
  "08:00 PM-08:30 PM",
  "08:30 PM-09:00 PM",
  "09:00 PM-09:30 PM",
  "09:30 PM-10:00 PM",
  "10:00 PM-10:30 PM",
  "10:30 PM-11:00 PM",
  "11:00 PM-11:30 PM",
  "11:30 PM-12:00 AM",
];
const hours = [
  "12:00 AM",
  "12:30 AM",
  "01:00 AM",
  "01:30 AM",
  "02:00 AM",
  "02:20 AM",
  "03:00 AM",
  "03:30 AM",
  "04:00 AM",
  "04:30 AM",
  "05:00 AM",
  "05:30 AM",
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",

  "08:00 PM",
  "08:30 PM",

  "09:00 PM",
  "09:30 PM",

  "10:00 PM",
  "10:30 PM",

  "11:00 PM",
  "11:30 PM",
];
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const copyToClipboard = () => {
  var textField = document.getElementById("meeting-link");
  textField.select();
  document.execCommand("copy");
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Scheduler() {
  const [teacher, setTeacher] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [category, setCategory] = useState("");
  const { width } = useWindowDimensions();
  const [categorizedData, setCategorizedData] = useState({});
  const [allSchedules, setAllSchedules] = useState([]);
  const [availableSlotsEditingMode, setAvailableSlotsEditingMode] = useState(
    false
  );
  const [scheduleId, setScheduleId] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    getAllSchedulesData();
  }, []);

  const getAllSchedulesData = () => {
    getOccupancy().then((data) => {
      setCategorizedData(data.data.data);
      setAllSchedules(data.data.allSchedules);
    });
  };

  const deleteSchedule = async () => {
    try {
      const deleteddata = await Axios.get(
        `${process.env.REACT_APP_API_KEY}/schedule/delete/${scheduleId}`
      );
      getAllSchedulesData();
      setScheduleId("");
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const gotoZoomLink = (id, link) => {
    let newLink = link.split("/");
    window.open(
      `https://livekumonmeeting.netlify.app/meeting/${id}/${
        newLink[4].split("?")[0]
      }`,
      "_blank"
    );
  };
  const addOrRemoveAvailableSlot = (slot) => {
    if (!categorizedData[category][teacher].availableSlots.includes(slot)) {
      addAvailableTimeSlot(teacherId, slot)
        .then((data) => {
          setCategorizedData((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              [teacher]: {
                ...prev[category][teacher],
                availableSlots: [
                  ...prev[category][teacher].availableSlots,
                  slot,
                ],
              },
            },
          }));
        })
        .catch((err) => console.log(err));
    } else {
      deleteAvailableTimeSlot(teacherId, slot)
        .then((data) => {
          setCategorizedData((prev) => {
            let allData = { ...prev };
            let data = [...allData[category][teacher].availableSlots];
            let index = data.indexOf(slot);
            data.splice(index, 1);
            allData[category][teacher].availableSlots = data;
            return allData;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    setSelectedSchedule(
      allSchedules.filter((schedule) => schedule._id === scheduleId)[0]
    );
  }, [scheduleId, allSchedules]);

  return (
    <>
      <OccupancyBars
        categorizedData={categorizedData}
        setTeacher={setTeacher}
        setTeacherId={setTeacherId}
        setCategory={setCategory}
      />
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
      <Dialog
        open={!!scheduleId}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setScheduleId("")}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Schedule Details
        </DialogTitle>
        <DialogContent>
          <h3>Students:</h3>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {selectedSchedule ? (
              <>
                {selectedSchedule.students
                  ? selectedSchedule.students.map((student) => (
                      <Chip
                        color="primary"
                        style={{ margin: "0 5px" }}
                        label={student.firstName}
                      />
                    ))
                  : ""}
                <TextField
                  style={{ margin: "20px 0" }}
                  fullWidth
                  readOnly
                  id="meeting-link"
                  label="Meeting Link"
                  variant="outlined"
                  value={selectedSchedule.meetingLink}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            copyToClipboard(selectedSchedule.meetingLink)
                          }
                        >
                          <FileCopyOutlined />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedSchedule.isClassTemperarilyCancelled}
                        onChange={() => {
                          updateScheduleDangerously(selectedSchedule._id, {
                            isClassTemperarilyCancelled: !selectedSchedule.isClassTemperarilyCancelled,
                          })
                            .then((response) => {
                              console.log(response);
                              getAllSchedulesData();
                            })
                            .catch((error) => {
                              console.log(error);
                              setSuccess(false);
                              setResponse("Something went wrong");
                              setSnackBarOpen(true);
                            });
                        }}
                        name="cancelClass"
                      />
                    }
                    label="Enable to Cancel the Class"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {selectedSchedule.isClassTemperarilyCancelled ? (
                      <>
                        <TextField
                          id="message"
                          label="Message"
                          fullWidth
                          variant="outlined"
                          value={selectedSchedule.message}
                          onChange={(e) => {
                            e.persist();
                            setSelectedSchedule((prev) => {
                              let oldSchedule = { ...prev };
                              let newSchedule = {
                                ...oldSchedule,
                                message: e.target.value,
                              };
                              return newSchedule;
                            });
                          }}
                        />
                        <Button
                          variant="contained"
                          style={{ marginLeft: "10px" }}
                          color="primary"
                          onClick={() => {
                            updateScheduleDangerously(selectedSchedule._id, {
                              message: selectedSchedule.message,
                            })
                              .then((response) => {
                                console.log(response);
                                getAllSchedulesData();
                                setSuccess(true);
                                setResponse(response.data.message);
                                setSnackBarOpen(true);
                              })
                              .catch((error) => {
                                console.log(error);
                                setSuccess(false);
                                setResponse(response.data.message);
                                setSnackBarOpen(true);
                              });
                          }}
                        >
                          {" "}
                          Submit{" "}
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setScheduleId("")}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Link
            style={{ textDecoration: "none" }}
            to={`/edit-schedule/${scheduleId}`}
          >
            <Button
              // onClick={() => setScheduleId("")}
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => deleteSchedule()}
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>

          <Button
            onClick={() =>
              gotoZoomLink(
                selectedSchedule.meetingAccount,
                selectedSchedule.meetingLink
              )
            }
            variant="outlined"
            style={{ backgroundColor: "#2ecc71", color: "white" }}
            startIcon={<AdjustIcon />}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>
      {teacher && teacherId ? (
        <>
          <h1 style={{ textAlign: "center", textTransform: "capitalize" }}>
            {" "}
            {teacher} Week Schedule{" "}
          </h1>
          <div
            style={{ display: "flex", flexDirection: "row", padding: "20px" }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={availableSlotsEditingMode}
                    onChange={() =>
                      setAvailableSlotsEditingMode((prev) => !prev)
                    }
                  />
                }
                label="Adjust Slots"
              />
            </FormGroup>
          </div>
          <div
            style={{
              height: "50px",
              display: "flex",
              flexDirection: "row",
              position: "sticky",
              top: "0px",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                width: width < 700 ? "10%" : "5%",
                backgroundColor: "#f1f2f6",
              }}
            />
            <div
              style={{
                width: width < 700 ? "90%" : "95%",
                backgroundColor: "#f1f2f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {days.map((day, i) => (
                  <div key={i} style={{}} className="schedulerHeader">
                    {" "}
                    {width < 700
                      ? day.toUpperCase().slice(0, 3)
                      : day.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
            <div
              style={{
                width: width < 700 ? "10%" : "5%",
                backgroundColor: "#EAF0F1",
              }}
            >
              {hours.map((hour, i) => (
                <div key={i} className="time-header">
                  {hour}
                </div>
              ))}
            </div>
            <div style={{ width: width < 700 ? "90%" : "95%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {times.map((time, i) => {
                  return (
                    <React.Fragment key={i}>
                      {days.map((day, j) => {
                        return (
                          <SingleBlock
                            selectedSlots={selectedSlots}
                            setSelectedSlots={setSelectedSlots}
                            allSchedules={allSchedules}
                            day={day}
                            time={time}
                            i={i}
                            j={j}
                            category={category}
                            teacher={teacher}
                            categorizedData={categorizedData}
                            availableSlotsEditingMode={
                              availableSlotsEditingMode
                            }
                            setScheduleId={setScheduleId}
                            addOrRemoveAvailableSlot={addOrRemoveAvailableSlot}
                            teacherID={teacherId}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            {selectedSlots.length ? (
              <div className="buttons">
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginRight: "20px" }}
                  onClick={() => setSelectedSlots([])}
                >
                  Cancel
                </Button>
                <Link
                  to={`/availabe-scheduler/${selectedSlots.join(
                    ","
                  )}/${teacherId}`}
                >
                  <Button variant="contained" color="primary">
                    Schedule
                  </Button>
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <span />
      )}
    </>
  );
}

export default Scheduler;
