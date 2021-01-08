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

const Attedance = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [names, setNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    const newDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  const onNameChange = (event, values) => {
    setUser(values);
  };

  const getAttendance = () => {
    getUserAttendance(user.customerId, selectedDate)
      .then((data) => {
        setTableData(data.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getUsers()
      .then((result) => {
        setNames(result.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          style={{ marginRight: "20px" }}
          color="primary"
          variant="contained"
        >
          Attendance By Student
        </Button>
        <Link to="/attendance/class" style={{ textDecoration: "none" }}>
          <Button>Attendance By Class</Button>
        </Link>
      </div>

      <div
        style={{
          margin: "0 auto",
          width: 400,
        }}
      >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          getOptionLabel={(option) => option.username + `(${option.userId})`}
          options={names}
          onChange={onNameChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Customer"
              margin="normal"
              variant="outlined"
            />
          )}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            fullWidth
            id="date-picker-dialog"
            label="Select starting Date"
            format="MM/dd/yyyy"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => getAttendance()}
        >
          Get Attedance
        </Button>
      </div>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        {" "}
        Classes Attended: {tableData.length}{" "}
      </h3>
      <TableContainer
        component={Paper}
        style={{ width: "80vw", margin: "0 auto", marginTop: "40px" }}
      >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Time Zone</TableCell>
              <TableCell align="right">Attedended</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => {
              return (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right"> {row.timeZone} </TableCell>
                  <TableCell align="right"> YES </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Attedance;
