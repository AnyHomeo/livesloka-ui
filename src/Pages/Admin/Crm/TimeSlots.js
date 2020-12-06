import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  List,
  ListItem,
} from "@material-ui/core/";
import TimeSlotCard from "./TimeSlotCard";
import { getOccupancy, getAllSlots } from "../../../Services/Services";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" width="100%" alignItems="center">
      <Box width="65%" mr={1}>
        <LinearProgress
          variant="determinate"
          color={props.value >= 70 ? "secondary" : "primary"}
          {...props}
        />
      </Box>
      <Box width="35%">
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}% Occupied`}</Typography>
      </Box>
    </Box>
  );
}

const TimeSlots = () => {
  const [teacher, setTeacher] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [categorizedData, setCategorizedData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  useEffect(() => {
    getOccupancy().then((data) => {
      setCategorizedData(data.data);
    });
  }, []);

  useEffect(() => {
    if (teacher) {
      getAllSlots(teacher)
        .then((data) => {
          setSlotsData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [teacher]);

  return (
    <>
      <Grid
        container
        spacing={3}
        style={{ margin: "0 auto", marginTop: "20px" }}
      >
        {Object.keys(categorizedData).map((category) => {
          return (
            <React.Fragment key={category}>
              {Object.keys(categorizedData[category]).length ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card style={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        align={"center"}
                        style={{ textTransform: "uppercase" }}
                      >
                        {category}
                      </Typography>
                      <List>
                        {Object.keys(categorizedData[category]).map(
                          (teacher) => {
                            let val;
                            let {
                              availableSlots,
                              scheduledSlots,
                              id,
                              TeacherName,
                            } = categorizedData[category][teacher];
                            if (
                              !availableSlots.length &&
                              !scheduledSlots.length
                            ) {
                              val = 0;
                            } else {
                              val =
                                (scheduledSlots.length /
                                  (scheduledSlots.length +
                                    availableSlots.length)) *
                                100;
                            }
                            return (
                              <ListItem
                                button
                                key={teacher}
                                onClick={() => {
                                  console.log(TeacherName);
                                  setTeacher(id);
                                  setTeacherName(teacher);
                                }}
                                style={{ flexDirection: "column" }}
                              >
                                <Typography
                                  color="textSecondary"
                                  style={{ width: "100%" }}
                                >
                                  {teacher}
                                </Typography>
                                <LinearProgressWithLabel value={val} />
                              </ListItem>
                            );
                          }
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <span />
              )}
            </React.Fragment>
          );
        })}
      </Grid>
      {teacher ? (
        <>
          <h1 style={{ textAlign: "center", margin: "20px 0" }}>
            {" "}
            {teacherName} Availability slots{" "}
          </h1>
          <Grid
            container
            spacing={3}
            style={{ margin: "0 auto", marginTop: "20px" }}
          >
            {Object.keys(slotsData).map((day) => {
              return (
                <Grid item xs={12} sm={6}>
                  <TimeSlotCard
                    day={day}
                    available={slotsData[day].availableSlots}
                    scheduledSlots={slotsData[day].scheduledSlots}
                    teacher={teacher}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default TimeSlots;
