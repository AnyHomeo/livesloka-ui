import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  Card,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  CircularProgress,
  Snackbar,
  Chip,
  Typography,
  Divider,
  Grid,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { FileCopy } from "@material-ui/icons";
const times = [
  "12:00 AM - 12:30 AM",
  "12:30 AM - 01:00 AM",
  "01:00 AM - 01:30 AM",
  "01:30 AM - 02:00 AM",
  "02:00 AM - 02:30 AM",
  "02:30 AM - 03:00 AM",
  "03:00 AM - 03:30 AM",
  "03:30 AM - 04:00 AM",
  "04:00 AM - 04:30 AM",
  "04:30 AM - 05:00 AM",
  "05:00 AM - 05:30 AM",
  "05:30 AM - 06:00 AM",
  "06:00 AM - 06:30 AM",
  "06:30 AM - 07:00 AM",
  "07:00 AM - 07:30 AM",
  "07:30 AM - 08:00 AM",
  "08:00 AM - 08:30 AM",
  "08:30 AM - 09:00 AM",
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 01:00 PM",
  "01:00 PM - 01:30 PM",
  "01:30 PM - 02:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
  "06:00 PM - 06:30 PM",
  "06:30 PM - 07:00 PM",
  "07:00 PM - 07:30 PM",
  "07:30 PM - 08:00 PM",
  "08:00 PM - 08:30 PM",
  "08:30 PM - 09:00 PM",
  "09:00 PM - 09:30 PM",
  "09:30 PM - 10:00 PM",
  "10:00 PM - 10:30 PM",
  "10:30 PM - 11:00 PM",
  "11:00 PM - 11:30 PM",
  "11:30 PM - 12:00 PM",
];

const TimeSlotCard = ({ day, teacher, available, scheduledSlots }) => {
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const handleTime = (event) => {
    setTime(event.target.value);
  };

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [scheduledTimeSlots, setScheduledTimeSlots] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [alert, setalert] = useState("");
  const postTimeSlots = async () => {
    const formData = {
      slot: `${day.toUpperCase()}-${time}`,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_KEY}/teacher/add/available/${teacher}`,
        formData
      );
      if (res.status === 200) {
        setAvailableTimeSlots((prev) => [...prev, formData.slot]);
        setSuccessOpen(true);
        setalert(res.data.message);
        setAlertColor("success");
      }
    } catch (error) {
      console.log(error.response);
      setSuccessOpen(true);
      setalert(error.response.data.error);
      setAlertColor("error");
    }

    setLoading(false);
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  useEffect(() => {
    setAvailableTimeSlots(available);
  }, [available]);

  useEffect(() => {
    setScheduledTimeSlots(scheduledSlots);
  }, [scheduledSlots]);

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

      <Card style={{ height: "100%" }}>
        <h3 style={{ textAlign: "center" }}>{day.toUpperCase()}</h3>
        <div>
          <Grid container>
            <Grid xs={12} sm={6}>
              <h3 style={{ marginLeft: "20px" }}>Available Time Slots</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "10px",
                }}
              >
                <FormControl style={{ width: "65%" }} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Time
                  </InputLabel>
                  <Select
                    value={time}
                    fullWidth
                    onChange={handleTime}
                    label="Time Slots"
                  >
                    {times.map((time) => (
                      <MenuItem value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ height: "50px", width: "30%" }}
                    onClick={postTimeSlots}
                  >
                    Add
                  </Button>
                )}
              </div>

              {availableTimeSlots.map((availableTimeSlot) => (
                <Chip
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                  label={`${availableTimeSlot.split("-")[1]}-${
                    availableTimeSlot.split("-")[2]
                  }`}
                  //  onClick={handleClick}
                  color="primary"
                  variant="outlined"
                  onDelete={() => {
                    axios
                      .post(
                        `${process.env.REACT_APP_API_KEY}/teacher/delete/slot/${teacher}`,
                        {
                          slot: availableTimeSlot,
                        }
                      )
                      .then((data) => {
                        let index = availableTimeSlots.indexOf(
                          availableTimeSlot
                        );
                        setAvailableTimeSlots((prev) => {
                          let data = [...prev];
                          data.splice(index, 1);
                          return data;
                        });
                        setSuccessOpen(true);
                        setalert("Slot deleted Successfully");
                        setAlertColor("success");
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                />
              ))}
            </Grid>
            <Grid item xs={12} sm={6}>
              <h3 style={{ marginLeft: "20px" }}>Scheduled Time Slots</h3>
              <List>
                {scheduledSlots.map((slot) => (
                  <>
                    <Divider variant="middle" component="li" />
                    <ListItem button>
                      <ListItemText
                        primary="09:00AM - 10:30AM"
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={{ display: "inline" }}
                              color="textPrimary"
                            >
                              Mary,Tison
                            </Typography>
                            {" — meeting every monday and tuesday"}
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments">
                          <DeleteIcon color="secondary" />
                        </IconButton>
                        <IconButton edge="end" aria-label="comments">
                          <FileCopy />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </>
                ))}
              </List>
            </Grid>
          </Grid>
          {/* {availableTimeSlots.length !== 0 ? (
            <List>
              {availableTimeSlots.map((availableTimeSlot) => (
                <ListItem button>
                  <ListItemText primary={availableTimeSlot} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon
                        onClick={async () => {
                          try {
                            const formData = {
                              slot: availableTimeSlot,
                            };
                            const data = await axios.post(
                              `${process.env.REACT_APP_API_KEY}/teacher/delete/slot/${teacher}`,
                              formData
                            );
                            getTimeSlots();
                          } catch (error) {
                            console.log(error.response);
                          }
                        }}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <p style={{ textAlign: "center", fontSize: "16px" }}>
              No time slots
            </p>
          )} */}
        </div>
      </Card>
    </>
  );
};

export default TimeSlotCard;
