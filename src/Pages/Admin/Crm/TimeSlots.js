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
import TimeSlotCard from "./TimeSlotCard";

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
  const [teacher, setTeacher] = useState("");

  return (
    <div>
      <Grid
        container
        spacing={3}
        style={{ margin: "0 auto", marginTop: "20px" }}
      >
        <Grid item xs={false} sm={3} />
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel id="selectTeacher">Select Teacher</InputLabel>
            <Select
              labelId="selectTeacher"
              id="selectTeachermain"
              fullWidth
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
        </Grid>
        <Grid item xs={false} sm={3} />
        {[
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ].map((day) => {
          return (
            <Grid item xs={12} sm={4} md={3}>
              <TimeSlotCard day={day} teacher={teacher} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default TimeSlots;
