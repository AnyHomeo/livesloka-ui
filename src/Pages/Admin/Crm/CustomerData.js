/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MaterialTable, { MTableBodyRow } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Adminsidebar from "../Adminsidebar";
import {
  getAllCustomerDetails,
  AddCustomer,
  getData,
  editCustomer,
  getAllAdmins,
  getAllTeachers,
} from "../../../Services/Services";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiAlert from "@material-ui/lab/Alert";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  TextField,
  Snackbar,
  Checkbox,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/core";
import Comments from "./Comments";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";

const loaderCss = css`
  margin-top: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    marginTop: "-10px",
    textAlign: "center",
  },
  space: {
    margin: "20px",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  input: {
    fullWidth: true,
  },
}));

const names = [
  "Class",
  "Time Zone",
  "Customer Status",
  "Currency",
  "Country",
  "Teacher",
  "Agent",
];

const status = [
  "className",
  "timeZoneName",
  "classStatusName",
  "currencyName",
  "countryName",
  "TeacherName",
  "AgentName",
];

const fetchDropDown = (index) => {
  var obj = {};
  getData(names[index])
    .then((data) => {
      data.data.result.forEach((item) => {
        obj[item.id] = item[status[index]];
      });
    })
    .catch((err) => {
      console.log(err);
    });
  return obj;
};

const fetchAdmins = () => {
  var obj = {};
  getAllAdmins()
    .then((fetchedData) => {
      fetchedData.data.result.forEach((dataObj) => {
        obj[dataObj.employeeId] = `${dataObj.firstName} ${dataObj.lastName}`;
      });
    })
    .catch((err) => {});
  return obj;
};
const fetchTeachers = () => {
  var obj = {};
  getAllTeachers()
    .then((fetchedData) => {
      fetchedData.data.result.forEach((dataObj) => {
        obj[dataObj.employeeId] = `${dataObj.firstName} ${dataObj.lastName}`;
      });
    })
    .catch((err) => {});
  return obj;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CrmDetails = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setdata] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const classDropdown = fetchDropDown(0);
  const timeZoneDropdown = fetchDropDown(1);
  const classStatusDropdown = fetchDropDown(2);
  const currencyDropdown = fetchDropDown(3);
  const countryDropdown = fetchDropDown(4);
  const teachersDropdown = fetchDropDown(5);
  const agentDropdown = fetchDropDown(6);
  const [selectedRow, setSelectedRow] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    const newDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
    setColumns([
      {
        title: "Time Zone",
        field: "timeZoneId",
        width: "1%",
        lookup: timeZoneDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      { title: "Id", field: "id", hidden: true },
      {
        title: "Student Name",
        field: "firstName",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Guardian",
        field: "lastName",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Class Name",
        field: "classId",
        width: "1%",
        lookup: classDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Email",
        field: "email",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Whatsapp",
        field: "whatsAppnumber",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Group",
        field: "oneToOne",
        type: "boolean",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <Checkbox
            labelstyle={{ color: "green" }}
            iconstyle={{ fill: "green" }}
            inputstyle={{ color: "green" }}
            style={{ color: "green" }}
            checked={props.value}
            onChange={(e) => props.onChange(!props.value)}
          />
        ),
      },
      {
        title: "Teacher Id",
        field: "teacherId",
        width: "1%",
        lookup: teachersDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Age",
        field: "age",
        type: "numeric",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <TextField
            type="number"
            inputProps={{ min: "0", step: "1" }}
            value={props.value}
            onChange={(e) => {
              if (e.target.value < 0) {
                return props.onChange(0);
              } else {
                return props.onChange(e.target.value);
              }
            }}
          />
        ),
      },
      {
        title: "Country",
        field: "countryId",
        lookup: countryDropdown,
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "No of Students",
        field: "numberOfStudents",
        type: "numeric",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <TextField
            type="number"
            inputProps={{ min: "0", step: "1" }}
            value={props.value}
            onChange={(e) => {
              if (e.target.value < 0) {
                return props.onChange(0);
              } else {
                return props.onChange(e.target.value);
              }
            }}
          />
        ),
      },
      {
        title: "Proposed Amount",
        field: "proposedAmount",
        type: "numeric",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <TextField
            type="number"
            inputProps={{ min: "0", step: "1" }}
            value={props.value}
            onChange={(e) => {
              if (e.target.value < 0) {
                return props.onChange(0);
              } else {
                return props.onChange(e.target.value);
              }
            }}
          />
        ),
      },
      {
        title: "Proposed Currency",
        field: "proposedCurrencyId",
        width: "1%",
        lookup: currencyDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Place Of Stay",
        field: "placeOfStay",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Customer Status",
        field: "classStatusId",
        width: "1%",
        lookup: classStatusDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Agent Id",
        field: "agentId",
        width: "1%",
        lookup: agentDropdown,
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Zoom Color",
        field: "zoomcolor",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Meeting Link",
        field: "meetingLink",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Customer Id",
        field: "customerId",
        editable: "never",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Joining Date",
        field: "joindate",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              format="MM/dd/yyyy"
              style={{ width: "140px" }}
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        ),
      },
      {
        title: "Phone No",
        field: "phone",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
      },
      {
        title: "Study material Sent",
        field: "studyMaterialSent",
        type: "boolean",
        width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },
        editComponent: (props) => (
          <Checkbox
            labelstyle={{ color: "green" }}
            iconstyle={{ fill: "green" }}
            inputstyle={{ color: "green" }}
            style={{ color: "green" }}
            checked={props.value}
            onChange={(e) => props.onChange(!props.value)}
          />
        ),
      },
    ]);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllCustomerDetails();
      let details = data.data.result;
      setdata(details);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <>
      <Adminsidebar />
      <ClipLoader size={48} color="blue" css={loaderCss} loading={loading} />
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
      <div>
        <MaterialTable
          stickyHeader
          style={{
            maxWidth: "93%",
            minHeight: "60vh",
            margin: "0 auto",
            marginBottom: "100px",
            marginLeft: "80px",
          }}
          // className={classes.content}
          title="Customer data"
          columns={columns}
          data={data}
          options={{
            paging: false,
            actionsColumnIndex: 0,
            addRowPosition: "first",
            maxBodyHeight: 600,
            grouping: true,
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? "#CCC" : "#FFF",
            }),
          }}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          actions={[
            (rowData) => ({
              icon: "comment",
              tooltip: "Add comment",
              onClick: (event, rowData) => {
                setOpen(true);
                setName(rowData.firstName);
                setId(rowData._id);
              },
            }),
          ]}
          components={{
            Row: (props) => (
              <MTableBodyRow
                {...props}
                onDoubleClick={(e) => {
                  props.actions[2]().onClick(e, props.data);
                }}
              />
            ),
          }}
          editable={{
            onRowAdd: (newData) => {
              return AddCustomer(newData)
                .then((fetchedData) => {
                  console.log(fetchedData)
                  if (fetchedData.data.status === "OK") {
                    setdata([...data, newData]);
                    setSuccess(true);
                    setResponse(fetchedData.data.message);
                    setSnackBarOpen(true);
                  } else {
                    setSuccess(false);
                    setResponse(fetchedData.data.message);
                    setSnackBarOpen(true);
                  }
                })
                .catch((err) => {
                  console.log(err,err.response);
                  setSuccess(false);
                  if(err.response && err.response.error){
                    setResponse(err.response.error)
                  }else{
                  setResponse("Something went wrong,Please try again!");
                  }
                  setSnackBarOpen(true);
                });
            },
            onRowUpdate: (newData, oldData) => {
              return editCustomer(newData)
                .then((fetchedData) => {
                  if (fetchedData.data.status === "OK") {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setdata([...dataUpdate]);
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
                  console.log(err);
                  setSuccess(false);
                  setResponse("Something went wrong,Try again later");
                  setSnackBarOpen(true);
                });
            },
          }}
        />
      </div>

      <Dialog
        open={open}
        fullScreen
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              See all {name}'s Comments here
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Toolbar>
        </AppBar>
        <Comments id={id} name={name} />
      </Dialog>
    </>
  );
};

export default CrmDetails;
