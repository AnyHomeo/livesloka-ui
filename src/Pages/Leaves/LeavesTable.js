import MaterialTable from "material-table";
import React from "react";
import useWindowDimensions from "./../../Components/useWindowDimensions";
import {
  deleteALeave,
  getAllLeaves,
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
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import { isAutheticated } from "../../auth";
import LeavesTableMobile from "../Admin/Crm/MobileViews/LeavesTableMobile";
import useDocumentTitle from "../../Components/useDocumentTitle";
let arr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function LeavesTable() {
  useDocumentTitle("Leaves - LiveSloka");

  const { height } = useWindowDimensions();
  const [rows, setRows] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDateToCancel, setSelectedDateToCancel] = useState(new Date());
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [scheduleDays, setScheduleDays] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    getAllLeaves()
      .then((data) => {
        setRows(
          data.data.result.map((leave) => {
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

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const applyLeave = () => {
    Axios.post(`${process.env.REACT_APP_API_KEY}/cancelclass?isAdmin=true`, {
      cancelledDate: time,
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

  useEffect(() => {
    if (Object.keys(selectedCustomer).length && selectedDateToCancel) {
      Axios.get(
        `${process.env.REACT_APP_API_KEY}/cancelclass/start/end?date=${moment(
          selectedDateToCancel
        ).format("YYYY-MM-DD")}&agent=${isAutheticated().agentId}&customerId=${
          selectedCustomer._id
        }`
      )
        .then((data) => {
          setTime(data.data.result[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedDateToCancel, selectedCustomer]);

  useEffect(() => {
    if (Object.keys(selectedCustomer).length) {
      Axios.get(
        `${process.env.REACT_APP_API_KEY}/cancelclass/days/${
          selectedCustomer._id
        }?agent=${isAutheticated().agentId}`
      )
        .then((data) => {
          setScheduleDays(data.data.result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedCustomer]);

  const { width } = useWindowDimensions();

  const [searchField, setSearchField] = useState();
  const [filteredData, setFilteredData] = useState();

  useEffect(() => {
    filterData();
  }, [searchField]);

  const filterData = () => {
    function capitalizeFirstLetter(string) {
      return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    let value = searchField;

    let regex = new RegExp(`^${value}`, `i`);
    const sortedArr =
      rows &&
      rows.filter(
        (x) =>
          regex.test(x.className) ||
          regex.test(x.firstName) ||
          regex.test(x.lastName) ||
          regex.test(moment(x.cancelledDate).format("MMMM")) ||
          regex.test(moment(x.cancelledDate).format("Do")) ||
          regex.test(moment(x.cancelledDate).format("YYYY"))
      );

    setFilteredData(sortedArr);
  };

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
              if (v) {
                setSelectedCustomer(v);
              } else {
                setSelectedCustomer({});
              }
            }}
            options={allUsers}
            fullWidth
            style={{
              margin: "10px 0",
              minWidth: 310,
            }}
            getOptionLabel={(option) =>
              option.firstName
                ? `${option.firstName ? option.firstName : ""} (${
                    option.lastName ? option.lastName : ""
                  })`
                : ""
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
              key={scheduleDays}
              inputVariant="outlined"
              variant="static"
              value={selectedDateToCancel}
              onChange={(date, value) => {
                setSelectedDateToCancel(new Date(date));
              }}
              shouldDisableDate={(date) => {
                return !scheduleDays.includes(arr[new Date(date).getDay()]);
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
      {width > 768 ? (
        <>
          {" "}
          <MaterialTable
            title=""
            columns={[
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
                customFilterAndSearch: (filter, row, col) => {
                  return (
                    col
                      .render(row)
                      .toLowerCase()
                      .indexOf(filter.toLowerCase()) !== -1
                  );
                },
                render: (rowData) =>
                  moment(rowData.cancelledDate).format(
                    "MMMM Do YYYY, h:mm:ss A"
                  ),
              },
            ]}
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
        </>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            <TextField
              onChange={(e) => setSearchField(e.target.value)}
              variant="outlined"
              label="Search"
              style={{ width: "95%" }}
            />
          </div>

          {searchField ? (
            <>
              {filteredData.map((data) => (
                <LeavesTableMobile data={data} setRefresh={setRefresh} />
              ))}
            </>
          ) : (
            <>
              {" "}
              {rows.map((data) => (
                <LeavesTableMobile data={data} setRefresh={setRefresh} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LeavesTable;
