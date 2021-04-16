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
import Snackbar from "@material-ui/core/Snackbar";
import "date-fns";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  getAttendanceByScheduleId,
  getClasses,
  getStudentList,
  postStudentsAttendance,
} from "../../../Services/Services";
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AttedanceByClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

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
          setTableData(data.data.result.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
      getStudentList(selectedScheduleId)
        .then((data) => {
          setAllStudents(data.data.result.students);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedScheduleId]);

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedStudents([]);
    setSelectedDate(new Date());
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const addAttendance = () => {
    setDialogOpen(false);
    let selectedStudentIds = selectedStudents.map((student) => student._id);
    let absenteesIds = allStudents
      .filter((student) => !selectedStudentIds.includes(student._id))
      .map((student) => student._id);
    let formData = {
      scheduleId: selectedScheduleId,
      date: moment(selectedDate).format("YYYY-MM-DD"),
      customers: selectedStudentIds,
      requestedStudents: [],
      absentees: absenteesIds,
    };
    postStudentsAttendance(formData)
      .then((data) => {
        console.log(data);
        setLoading(true);
        setSuccess(true);
        setResponse(data.data.message);
        setSnackBarOpen(true);
        getAttendanceByScheduleId(selectedScheduleId)
          .then((data) => {
            setLoading(false);
            setTableData(data.data.result.reverse());
          })
          .catch((err) => {
            console.log(err);
            setSuccess(false);
            setResponse("Something Went Wrong");
            setSnackBarOpen(true);
          });
      })
      .catch((error) => {
        console.log(error);

        setSuccess(false);
        setResponse("Something Went Wrong");
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
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
            if (v && v._id) {
              setSelectedScheduleId(v._id);
            } else {
              setSelectedScheduleId("");
            }
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
        Classes Completed:{" "}
        <span
          style={{
            margin: "0 20px",
            fontSize: "1.3rem",
            fontWeight: "500",
          }}
        >
          {tableData.length}
        </span>
      </h3>
      <div style={{ width: "90vw", margin: "0 auto", height: "40px" }}>
        {selectedScheduleId ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Attendance
          </Button>
        ) : (
          ""
        )}
      </div>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Add Attendance</DialogTitle>
        <DialogContent>
          <div
            style={{
              width: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                format="dd-MM-yyyy"
                inputVariant="outlined"
                fullWidth
                margin="normal"
                label="Attendance Date"
                value={selectedDate}
                onChange={(d) => setSelectedDate(d)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <Autocomplete
              filterSelectedOptions
              options={allStudents}
              getOptionSelected={(option, value) => option._id === value._id}
              getOptionLabel={(option) =>
                `${option.firstName ? option.firstName : ""} ${
                  option.lastName ? option.lastName : ""
                }`
              }
              multiple
              fullWidth
              onChange={(e, v) => setSelectedStudents(v)}
              value={selectedStudents}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ width: "100%" }}
                  label="Students"
                  variant="outlined"
                  margin="normal"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={addAttendance}
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer
        component={Paper}
        style={{ width: "90vw", margin: "0 auto", marginTop: "10px" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Attedended Students</TableCell>
              <TableCell align="center">Requested Students</TableCell>
              <TableCell align="center">Requested Paid Students</TableCell>
              <TableCell align="center">Absent Students</TableCell>
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
                      style={{ margin: "0 5px" }}
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
                  {data.requestedPaidStudents.map((student) => (
                    <Chip
                      key={student._id}
                      style={{ margin: "0 5px" }}
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
                      style={{ margin: "0 5px" }}
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
                <TableCell align="right">
                  <Link
                    to={`/edit/attendance/${data.scheduleId}/${data.date}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary">
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
