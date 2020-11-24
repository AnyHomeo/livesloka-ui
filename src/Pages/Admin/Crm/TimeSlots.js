import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
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
import TimeSlotCard from "./TimeSlotCard";
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

const TimeSlots = () => {
  const [teacherName, setTeacherName] = useState();
  useEffect(() => {
    getTeachers();
  }, []);
  const getTeachers = async () => {
    const teacherNames = await axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
    );
    setTeacherName(teacherNames.data.result);
  };
  const classes = useStyles();
  const [teacher, setTeacher] = useState("");

  return (
    <div>
      <div
        style={{
          display: "block",
          margin: "0 auto",
          width: 200,
          marginTop: "30px",
        }}
      >
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <InputLabel id="demo-simple-select-outlined-label">
            Select Teacher
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            label="Select Teacher"
          >
            {teacherName &&
              teacherName.map((teacher) => (
                <MenuItem value={teacher.id}>{teacher.TeacherName}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ marginLeft: "30px" }}>
        <Grid
          container
          spacing={3}
          style={{ margin: "0 auto", marginTop: "20px" }}
        >
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="MONDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="TUESDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="WEDNESDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="THURSDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="FRIDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="SATURDAY" teacher={teacher} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TimeSlotCard day="SUNDAY" teacher={teacher} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TimeSlots;
