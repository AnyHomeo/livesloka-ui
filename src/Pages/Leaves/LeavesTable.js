import MaterialTable from "material-table";
import React from "react";
import useWindowDimensions from "./../../Components/useWindowDimensions";
import {
  deleteALeave,
  getAllLeaves,
  getUsers,
  updateLeave,
} from "./../../Services/Services";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";

function LeavesTable() {
  const { height } = useWindowDimensions();
  const [rows, setRows] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDateToCancel, setSelectedDateToCancel] = useState(new Date());
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        setRows(
          data.data.result.map((leave) => {
            console.log(leave.cancelledDate);
            return {
              _id: leave._id,
              firstName: leave.studentId.firstName,
              lastName: leave.studentId.lastName,
              className: leave.scheduleId.className,
              cancelledDate: leave.cancelledDate,
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  let columns = [
    {
      title: "First Name",
      field: "firstName",
      type: "string",
      editable: "never",
    },
    {
      title: "Last Name",
      field: "lastName",
      type: "string",
      editable: "never",
    },
    {
      title: "Class Name",
      field: "className",
      editable: "never",
      type: "string",
    },
    {
      title: "Date(User TimeZone)",
      field: "cancelledDate",
      type: "datetime",
      render: (rowData) =>
        moment(rowData.cancelledDate).format("DD-MM-YYYY hh:mm A"),
    },
  ];

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const applyLeave = () => {
    Axios.post(`${process.env.REACT_APP_API_KEY}/cancelclass?isAdmin=true`, {
      cancelledDate: selectedDateToCancel,
      studentId: selectedCustomer._id,
    })
      .then((data) => {
        setDialogOpen(false);
        setSuccess(true);
        setResponse(data.data.message);
        setSnackBarOpen(true);
        setSelectedDateToCancel(new Date());
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        setDialogOpen(false);
        setSuccess(false);
        setResponse(
          (err.response && err.response.data.error) || "Something went wrong!!"
        );
        setSnackBarOpen(true);
        setSelectedDateToCancel(new Date());
        setRefresh((prev) => !prev);
      });
  };

  useEffect(() => {
    if (!allUsers.length && dialogOpen) {
      Axios.get(
        `${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName,subjectId`
      )
        .then((data) => {
          setAllUsers(data.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dialogOpen]);

  return (
    <div>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          <h3>{"Add a Leave"}</h3>
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            id="combo-box-demo"
            value={selectedCustomer}
            onChange={(e, v) => {
              setSelectedCustomer(v);
            }}
            options={allUsers}
            fullWidth
            style={{
              margin: "10px 0",
            }}
            getOptionLabel={(option) =>
              `${option.firstName ? option.firstName : ""} (${
                option.lastName ? option.lastName : ""
              } )`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Customer"
                variant="outlined"
              />
            )}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              margin="normal"
              fullWidth
              disablePast
              id="date-picker-dialog"
              label="Select Leave Date"
              inputVariant="outlined"
              variant="static"
              value={selectedDateToCancel}
              onChange={(date, value) => {
                setSelectedDateToCancel(new Date(date));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={applyLeave} color="primary">
            Add Leave
          </Button>
        </DialogActions>
      </Dialog>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        {" "}
        Leaves Applied by Customers{" "}
      </h1>
      <Button
        style={{ marginLeft: "20px" }}
        color="primary"
        onClick={() => setDialogOpen(true)}
        variant="contained"
      >
        Apply Leave
      </Button>
      <MaterialTable
        title=""
        columns={columns}
        style={{
          margin: "20px",
          padding: "20px",
        }}
        data={rows}
        options={{
          exportButton: true,
          paging: false,
          maxBodyHeight: height - 240,
        }}
        editable={{
          onRowUpdate: (newData, oldData) => {
            return updateLeave(newData)
              .then((fetchedData) => {
                if (fetchedData.data) {
                  const dataUpdate = [...rows];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setRows([...dataUpdate]);
                  setSuccess(true);
                  setResponse(fetchedData.data.message);
                  setSnackBarOpen(true);
                } else {
                  setSuccess(false);
                  setResponse(
                    fetchedData.data.error ||
                      "Something went wrong,Try again later"
                  );
                  setSnackBarOpen(true);
                }
              })
              .catch((err) => {
                console.error(err);
                setSuccess(false);
                setResponse("Something went wrong,Try again later");
                setSnackBarOpen(true);
              });
          },
          onRowDelete: (oldData) =>
            deleteALeave(oldData._id)
              .then((res) => {
                const dataDelete = [...rows];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setRows([...dataDelete]);
                setSuccess(true);
                setResponse(res.data.message);
                setSnackBarOpen(true);
              })
              .catch((err) => {
                console.error(err, err.response);
                setSuccess(false);
                setResponse("unable to delete customer, Try again");
                setSnackBarOpen(true);
              }),
        }}
      />
    </div>
  );
}

export default LeavesTable;
