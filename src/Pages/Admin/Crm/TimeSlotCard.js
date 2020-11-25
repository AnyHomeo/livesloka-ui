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
} from "@material-ui/core";
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

const TimeSlotCard = ({ day, teacher }) => {
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
      await axios.post(
        `${process.env.REACT_APP_API_KEY}/teacher/add/available/${teacher}`,
        formData
      );
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (teacher) {
      getTimeSlots();
    }
  }, [teacher, availableTimeSlots]);

  const getTimeSlots = async () => {
    const timeSlotsData = await axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=${day}`
    );
    setAvailableTimeSlots(timeSlotsData.data.result);
  };

  return (
    <Card style={{ height: "100%" }}>
      <h3 style={{ textAlign: "center" }}>{day}</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <FormControl style={{ width: "70%" }} variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">Time</InputLabel>
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
        <Button
          variant="contained"
          color="primary"
          style={{ height: "50px", width: "30%" }}
          onClick={postTimeSlots}
        >
          Add
        </Button>
      </div>
      <div>
        <h3 style={{ marginLeft: "20px" }}>Available Time Slots</h3>
        {availableTimeSlots.length !== 0 ? (
          <List>
            {availableTimeSlots.map((availableTimeSlot) => (
              <ListItem button>
                <ListItemText primary={availableTimeSlot} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px" }}>No time slots</p>
        )}
      </div>
    </Card>
  );
};

export default TimeSlotCard;
