import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Adminsidebar from "../Adminsidebar";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("16-02-2000", "9:15 PM", "Yes"),
  createData("16-02-2000", "8:20 PM", "Yes"),
];

const Attedance = () => {
  const classes = useStyles();
  const [names, setNames] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    const newDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  const onNameChange = (event, values) => {
    setNames(values);
    console.log(event.target);
  };

  console.log(names);
  return (
    <>
      <Adminsidebar />
      <p style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
        Attedance
      </p>
      <div
        style={{
          margin: "0 auto",
          width: 300,
        }}
      >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          getOptionLabel={(option) => option.title}
          options={top100Films}
          onChange={onNameChange}
          renderInput={(params) => (
            
            <TextField
              {...params}
              label="Student"
              margin="normal"
              variant="outlined"
            />
          )}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date picker dialog"
            format="MM/dd/yyyy"
            value={selectedDate}
            style={{ marginLeft: "25px" }}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <Button
          style={{ marginLeft: "50px", marginTop: "20px" }}
          variant="contained"
          color="primary"
        >
          Get Attedance
        </Button>
      </div>

      <TableContainer
        component={Paper}
        style={{ width: "800px", margin: "0 auto", marginTop: "40px" }}
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
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Attedance;
const top100Films = [
  { title: "Kamal", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
];
