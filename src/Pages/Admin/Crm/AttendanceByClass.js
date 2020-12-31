import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";
import { getUsers, getUserAttendance } from "../../../Services/Services";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

const AttedanceByClass = () => {
  const classes = useStyles();

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
          getOptionLabel={(option) => option.username + `(${option.userId})`}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select ClassName"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <Button fullWidth variant="contained" color="primary">
          Get Attedance
        </Button>
      </div>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        {" "}
        Classes Completed:
      </h3>
      <TableContainer
        component={Paper}
        style={{ width: "90vw", margin: "0 auto", marginTop: "40px" }}
      >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Attedended</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="right">2</TableCell>
              <TableCell align="right"> 4 </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AttedanceByClass;
