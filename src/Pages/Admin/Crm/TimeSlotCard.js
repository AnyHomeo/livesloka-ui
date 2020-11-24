import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import {
  Card,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
} from "@material-ui/core/";
import AddBoxIcon from "@material-ui/icons/AddBox";
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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const TimeSlotCard = ({ day, teacher }) => {
  const classes = useStyles();

  const [time, setTime] = useState("");

  const handleTime = (event) => {
    setTime(event.target.value);
  };

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const postTimeSlots = async () => {
    const formData = {
      slot: `${day}-${time}`,
    };

    try {
      const newData = await axios.post(
        `https://livekumon-development-services.herokuapp.com/teacher/add/available/${teacher}`,
        formData
      );
      console.log(newData);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    console.log(teacher);
    if (teacher) {
      getTimeSlots();
    }
  }, [teacher]);

  const getTimeSlots = async () => {
    const timeSlotsData = await axios.get(
      `https://livekumon-development-services.herokuapp.com/teacher/available/${teacher}?day=${day}`
    );
    setAvailableTimeSlots(timeSlotsData.data.result);
  };

  return (
    <Card className={classes.root}>
      <h3 style={{ textAlign: "center" }}>{day}</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Time</InputLabel>
            <Select value={time} onChange={handleTime} label="Time Slots">
              {times.map((time) => (
                <MenuItem value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <IconButton>
            <AddBoxIcon style={{ color: "black" }} onClick={postTimeSlots} />
          </IconButton>
        </div>
      </div>
      <div>
        <h3 style={{ marginLeft: "20px" }}>Available Time Slots</h3>
        {availableTimeSlots.length !== 0 ? (
          availableTimeSlots.map((availableTimeSlot) => (
            <ul>
              <li>{availableTimeSlot}</li>
              {console.log(availableTimeSlot)}
            </ul>
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px" }}>No time slots</p>
        )}
      </div>
    </Card>
  );
};

export default TimeSlotCard;
