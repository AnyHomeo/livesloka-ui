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
import { Box, Button, Tab, Tabs } from "@material-ui/core";
import moment from "moment";
import { getUsers, getUserAttendance } from "../../../Services/Services";
import AttedanceByClass from "./AttendanceByClass";
import useDocumentTitle from "../../../Components/useDocumentTitle";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  root: {
    flexGrow: 1,
  },
  tabs: {
    borderRight: `1px solid black`,
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}
const Attedance = () => {
  useDocumentTitle("Attendance");
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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={classes.root}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Class" href="/drafts" {...a11yProps(0)} />
          <LinkTab label="Student" href="/trash" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <AttedanceByClass />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{
              margin: "0 auto",
              width: 300,
            }}
          >
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              getOptionLabel={(option) =>
                option.username + `(${option.userId})`
              }
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
                        {moment(row.date, "YYYY-MM-DD").format("MMMM Do YYYY")}
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
        </TabPanel>
      </div>
      {/* <div style={{ textAlign: "center", marginTop: "30px" }}>
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
      </div> */}
    </>
  );
};

export default Attedance;
