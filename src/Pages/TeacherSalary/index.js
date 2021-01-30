import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { getAttendanceByScheduleId } from "../../Services/Services";
import {
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  CircularProgress,
  Snackbar,
  Chip,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import Select from "@material-ui/core/Select";
import "./HistoryCells.css";
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const ExtraTeacherDetails = ({ open, scheduleId }) => {
  const [scheduleData, setscheduleData] = useState();

  useEffect(() => {
    if (scheduleId) {
      getClassesBySchedule();
    }
  }, []);

  const getClassesBySchedule = async () => {
    const data = await getAttendanceByScheduleId(scheduleId);
    console.log(data);
    setscheduleData(data && data.data.result);
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Attedended Students</TableCell>
            <TableCell align="center">Requested Students</TableCell>
            <TableCell align="center">Absent Students</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scheduleData &&
            scheduleData.map((data) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {data.date}
                </TableCell>
                <TableCell align="center">{data.time}</TableCell>
                <TableCell align="center">
                  {data.customers.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ marginBottom: 5 }}
                      label={
                        student.firstName
                          ? student.firstName
                          : student.email
                          ? student.email
                          : "Noname"
                      }
                      size="medium"
                    />
                  ))}
                </TableCell>
                <TableCell align="center">
                  {data.requestedStudents.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ marginBottom: 5 }}
                      label={
                        student.firstName
                          ? student.firstName
                          : student.email
                          ? student.email
                          : "Noname"
                      }
                      size="medium"
                      color="primary"
                    />
                  ))}
                </TableCell>
                <TableCell align="center">
                  {data.absentees.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ marginBottom: 5 }}
                      label={
                        student.firstName
                          ? student.firstName
                          : student.email
                          ? student.email
                          : "Noname"
                      }
                      size="medium"
                      color="secondary"
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Collapse>
  );
};
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const TableRowDetails = ({
    noOfDays,
    noOfStudents,
    commission,
    totalSalary,
    className,
    scheduleId,
  }) => {
    const [newOpen, setnewOpen] = React.useState(false);

    return (
      <>
        <TableRow key={className}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setnewOpen(!newOpen);
              }}
            >
              {newOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <p className="Tablecell">{className}</p>
          </TableCell>

          <TableCell>
            <p className="Tablecell">{noOfDays}</p>
          </TableCell>

          <TableCell>
            <p className="Tablecell">{noOfStudents}</p>
          </TableCell>
          <TableCell align="right">
            <p className="Tablecell">{commission}</p>
          </TableCell>

          <TableCell align="right">
            <p className="Tablecell">{totalSalary}</p>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan="6">
            <ExtraTeacherDetails open={newOpen} scheduleId={scheduleId} />
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <p style={{ fontWeight: "bold" }}>{row.name}</p>
        </TableCell>
        <TableCell>
          <p style={{ fontWeight: "bold" }}>{row.totalSalary}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div
                style={{
                  marginBottom: "40px",
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Add Amount"
                  variant="outlined"
                />

                <Button color="primary" variant="contained">
                  Finalize Amount
                </Button>
              </div>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}></p>
                    </TableCell>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}>Class Name</p>
                    </TableCell>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}>No Of Days</p>
                    </TableCell>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}>No Of Students</p>
                    </TableCell>
                    <TableCell align="right">
                      <p style={{ fontWeight: "bold" }}>Commission</p>
                    </TableCell>
                    <TableCell align="right">
                      <p style={{ fontWeight: "bold" }}>Total Salary</p>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(row.details).map((historyRow) => {
                    return (
                      <>
                        <TableRowDetails
                          key={row.details[historyRow].scheduleId}
                          scheduleId={row.details[historyRow].scheduleId}
                          className={historyRow}
                          noOfDays={row.details[historyRow].noOfDays}
                          noOfStudents={
                            row.details[historyRow].numberOfStudents
                          }
                          commission={row.details[historyRow].commission}
                          totalSalary={row.details[historyRow].totalSalary}
                        />

                        {/* <ExtraTeacherDetails open={newOpen} /> */}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const TeacherSalary = () => {
  const [salaryData, setSalaryData] = useState();
  const [getDate, setGetDate] = useState();
  const [loading, setLoading] = useState(false);
  const [salDates, setSalDates] = useState([]);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const handleChange = (event) => {
    setGetDate(event.target.value);
    getSalaries(event.target.value);
  };

  const getSalDates = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/salary/months`
    );
    setSalDates(data && data.data.result);
  };

  const getSalaries = async (date) => {
    setLoading(true);
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_KEY}/salary/all?month=${date}`
      );
      setSalaryData(data && data.data.finalDataObjectArr);
      console.log(data);
    } catch (error) {
      console.log(error.response);
      setSuccessOpen(true);
      setSalaryData();
    }
    setLoading(false);
  };

  useEffect(() => {
    getSalDates();
  }, []);

  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSuccessClose} severity="error">
          Error in retrieving salaries
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "20px", width: 300 }}>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-outlined-label">
              Select Month
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={getDate}
              onChange={handleChange}
              label="Select Month"
            >
              {salDates &&
                salDates.map((dates) => (
                  <MenuItem key={dates} value={dates}>
                    {moment(dates).format("MMM YYYY")}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        {loading ? (
          <div style={{ marginTop: 40 }}>
            <CircularProgress />
          </div>
        ) : (
          <div style={{ width: "50%", marginTop: "40px" }}>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <h3 style={{ color: "#2c3e50" }}>Teacher Name</h3>
                    </TableCell>
                    <TableCell>
                      <h3 style={{ color: "#2c3e50" }}>Total Salary</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaryData &&
                    salaryData.map((row) => <Row key={row.id} row={row} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherSalary;

const top100Films = [{ title: "2021-01", value: "Jan 2021" }];