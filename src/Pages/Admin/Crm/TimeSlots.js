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
    <>
      <Grid
        container
        spacing={3}
        style={{ margin: "0 auto", marginTop: "20px" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" align={"center"}>
                Dance
              </Typography>
              <List>
                <ListItem
                  button
                  onClick={() => setTeacher("Kamal")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Kamal
                  </Typography>
                  <LinearProgressWithLabel value={40} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => setTeacher("Karthik")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Karthik
                  </Typography>
                  <LinearProgressWithLabel value={90} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => setTeacher("Ram Kishore")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Ram
                  </Typography>
                  <LinearProgressWithLabel value={20} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" align={"center"}>
                Songs
              </Typography>
              <List>
                <ListItem
                  button
                  onClick={() => setTeacher("Kamal")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Kamal
                  </Typography>
                  <LinearProgressWithLabel value={40} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => setTeacher("Karthik")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Karthik
                  </Typography>
                  <LinearProgressWithLabel value={70} />
                </ListItem>
                <ListItem button style={{ flexDirection: "column" }}>
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Ram
                  </Typography>
                  <LinearProgressWithLabel value={60} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => setTeacher("Ram Kishore")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Ram Kishore
                  </Typography>
                  <LinearProgressWithLabel value={20} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" align={"center"}>
                Sloka
              </Typography>
              <List>
                <ListItem
                  button
                  onClick={() => setTeacher("Kamal")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Kamal
                  </Typography>
                  <LinearProgressWithLabel value={80} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => setTeacher("Karthik")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Karthik
                  </Typography>
                  <LinearProgressWithLabel value={90} />
                </ListItem>
                <ListItem button style={{ flexDirection: "column" }}>
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Ram
                  </Typography>
                  <LinearProgressWithLabel value={20} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h4" align={"center"}>
                Languages
              </Typography>
              <List>
                <ListItem
                  button
                  onClick={() => setTeacher("Bhargavan")}
                  style={{ flexDirection: "column" }}
                >
                  <Typography
                    color="textSecondary"
                    style={{ width: "100%" }}
                    gutterBottom
                  >
                    Bhargavan
                  </Typography>
                  <LinearProgressWithLabel value={80} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {teacher ? (
        <>
          <h1 style={{ textAlign: "center", margin: "20px 0" }}>
            {" "}
            {teacher} Availability slots{" "}
          </h1>
          <Grid
            container
            spacing={3}
            style={{ margin: "0 auto", marginTop: "20px" }}
          >
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
        </>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default TimeSlots;
