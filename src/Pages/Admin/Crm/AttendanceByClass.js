import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import { Button, Chip, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  getAttendanceByScheduleId,
  getClasses,
} from "../../../Services/Services";

const AttedanceByClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  useEffect(() => {
    getClasses().then((data) => {
      setClasses(data.data.result);
    });
  }, []);

  useEffect(() => {
    if (selectedScheduleId) {
      setLoading(true);
      getAttendanceByScheduleId(selectedScheduleId)
        .then((data) => {
          setLoading(false);
          setTableData(data.data.result);
          console.log(data.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedScheduleId]);

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/attendance" style={{ textDecoration: "none" }}>
          <Button style={{ marginRight: "20px" }}>Attendance By Student</Button>
        </Link>
        <Button color="primary" variant="contained">
          Attendance By Class
        </Button>
      </div>
      <div
        style={{
          margin: "0 auto",
          maxWidth: 400,
        }}
      >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={classes}
          getOptionLabel={(option) => option.className}
          onChange={(e, v) => {
            setSelectedScheduleId(v._id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select ClassName"
              margin="normal"
              variant="outlined"
            />
          )}
        />

        <div style={{ textAlign: "center", height: "40px" }}>
          {loading ? <CircularProgress /> : ""}
        </div>
      </div>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        {" "}
        Classes Completed:{tableData.length}
      </h3>
      <TableContainer
        component={Paper}
        style={{ width: "90vw", margin: "0 auto", marginTop: "40px" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Attedended Students</TableCell>
              <TableCell align="center">Requested Students</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((data) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {data.date}
                </TableCell>
                <TableCell align="center">{data.time}</TableCell>
                <TableCell align="center">
                  {data.customers.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ margin: "0 5px" }}
                      label={student.firstName}
                      size="medium"
                    />
                  ))}
                </TableCell>
                <TableCell align="center">
                  {data.requestedStudents.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ margin: "0 5px" }}
                      label={student.firstName}
                      size="medium"
                      color="primary"
                    />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <Link
                    to={`/edit/attendance/${data.scheduleId}/${data.date}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="secondary">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AttedanceByClass;
