import React, { useEffect, useState } from "react";
import MaterialTable, { MTableBodyRow } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {
  getAllCustomerDetails,
  AddCustomer,
  getData,
  editCustomer,
  deleteUser,
} from "../../../Services/Services";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiAlert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
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
import Comments from "./Comments";

import "date-fns";
import moment from "moment";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import Drawer from "@material-ui/core/Drawer";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isAutheticated } from "../../../auth";
import { getSettings, updateSettings } from "../../../Services/Services";

const copyToClipboard = (text) => {
  var textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
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
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const names = [
  "Class",
  "Time Zone",
  "Class Status",
  "Currency",
  "Country",
  "Teacher",
  "Agent",
  "Category",
];

const status = [
  "className",
  "timeZoneName",
  "classStatusName",
  "currencyName",
  "countryName",
  "TeacherName",
  "AgentName",
  "categoryName",
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
      console.error(err);
    });
  return obj;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const classDropdown = fetchDropDown(0);
const timeZoneDropdown = fetchDropDown(1);
const classStatusDropdown = fetchDropDown(2);
const currencyDropdown = fetchDropDown(3);
const countryDropdown = fetchDropDown(4);
const teachersDropdown = fetchDropDown(5);
const agentDropdown = fetchDropDown(6);
const categoryDropdown = fetchDropDown(7);

const ColumnFilterDrawer = ({
  drawerOpen,
  setDrawerOpen,
  columnFilters,
  setColumnFilters,
  classes,
}) => (
  <Drawer
    anchor={"right"}
    open={drawerOpen}
    onClose={() => {
      let arr = [];
      Object.keys(columnFilters).forEach((column) => {
        if (columnFilters[column].selected) {
          arr.push(column);
        }
      });
      let id = isAutheticated()._id;
      if (id) {
        updateSettings(id, {
          columns: arr,
        });
      }
      setDrawerOpen(false);
    }}
  >
    <div className={classes.list} role="presentation">
      <h2 style={{ textAlign: "center", paddingTop: "10px" }}>
        {" "}
        Filter Columns{" "}
      </h2>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {Object.keys(columnFilters).map((column, i) => {
            return (
              <FormControlLabel
                key={i}
                onChange={() => {
                  setColumnFilters((prev) => {
                    return {
                      ...prev,
                      [column]: {
                        selected: !prev[column].selected,
                        name: prev[column].name,
                      },
                    };
                  });
                }}
                control={<Checkbox checked={columnFilters[column].selected} />}
                label={columnFilters[column].name}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  </Drawer>
);

const CrmDetails = () => {
  const { height, width } = useWindowDimensions();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  const handleDateChange = (date) => {
    const newDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    if (Object.keys(columnFilters).length) {
      setColumns([
        {
          title: "Customer Status",
          field: "classStatusId",
          width: "1%",
          lookup: classStatusDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["classStatusId"].selected,
        },
        {
          title: "Time Zone",
          field: "timeZoneId",
          width: "1%",
          lookup: timeZoneDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["timeZoneId"].selected,
        },
        { title: "Id", field: "id", hidden: true },
        {
          title: "Student Name",
          field: "firstName",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["firstName"].selected,
        },
        {
          title: "Guardian",
          field: "lastName",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["lastName"].selected,
        },
        {
          title: "Age",
          field: "age",
          type: "numeric",
          width: "1%",
          hidden: !columnFilters["age"].selected,
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
          title: "Gender",
          field: "gender",
          width: "1%",
          lookup: { male: "Male", female: "Female" },
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["gender"].selected,
        },
        {
          title: "Class Name",
          field: "classId",
          width: "1%",
          lookup: classDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["classId"].selected,
        },
        {
          title: "Email",
          field: "email",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["email"].selected,
          render: (rowData) => (
            <>
              {rowData.email ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title={`Copy to Clipboard`}>
                    <FileCopyOutlinedIcon
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => copyToClipboard(rowData.email)}
                    />
                  </Tooltip>
                  {rowData.email}
                </div>
              ) : (
                <span />
              )}
            </>
          ),
        },
        {
          title: "Whatsapp",
          field: "whatsAppnumber",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["whatsAppnumber"].selected,
        },
        {
          title: "Group",
          field: "oneToOne",
          type: "boolean",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["oneToOne"].selected,
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
          title: "Teacher",
          field: "teacherId",
          width: "1%",
          lookup: teachersDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["teacherId"].selected,
        },
        {
          title: "Country",
          field: "countryId",
          lookup: countryDropdown,
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["countryId"].selected,
        },
        {
          title: "No of Students",
          field: "numberOfStudents",
          type: "numeric",
          width: "1%",
          hidden: !columnFilters["numberOfStudents"].selected,
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
          hidden: !columnFilters["proposedAmount"].selected,
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
          hidden: !columnFilters["proposedCurrencyId"].selected,
          width: "1%",
          lookup: currencyDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Place Of Stay",
          field: "placeOfStay",
          hidden: !columnFilters["placeOfStay"].selected,
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Agent Id",
          field: "agentId",
          width: "1%",
          lookup: agentDropdown,
          hidden: !columnFilters["agentId"].selected,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Schedule Description",
          field: "scheduleDescription",
          width: "1%",
          hidden: !columnFilters["scheduleDescription"].selected,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Category",
          field: "categoryId",
          width: "1%",
          lookup: categoryDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["categoryId"].selected,
        },
        // {
        //   title: "Zoom Color",
        //   field: "zoomColor",
        //   width: "1%",
        //   cellStyle: { whiteSpace: "nowrap" },
        //   headerStyle: { whiteSpace: "nowrap" },
        // },
        {
          title: "Meeting Link",
          field: "meetingLink",
          hidden: !columnFilters["meetingLink"].selected,
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          render: (rowData) => (
            <>
              {rowData.meetingLink ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title={`Copy to Clipboard`}>
                    <FileCopyOutlinedIcon
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => copyToClipboard(rowData.meetingLink)}
                    />
                  </Tooltip>
                  {rowData.meetingLink}
                </div>
              ) : (
                <span />
              )}
            </>
          ),
        },
        // {
        //   title: "Customer Id",
        //   field: "customerId",
        //   editable: "never",
        //   width: "1%",
        //   cellStyle: { whiteSpace: "nowrap" },
        //   headerStyle: { whiteSpace: "nowrap" },
        // },
        // {
        //   title: "Joining Date",
        //   field: "joindate",
        //   width: "1%",
        //   cellStyle: { whiteSpace: "nowrap" },
        //   headerStyle: { whiteSpace: "nowrap" },
        //   editComponent: (props) => (
        //     <MuiPickersUtilsProvider utils={DateFnsUtils}>
        //       <KeyboardDatePicker
        //         margin="normal"
        //         format="MM/dd/yyyy"
        //         style={{ width: "140px" }}
        //         value={selectedDate}
        //         onChange={handleDateChange}
        //         KeyboardButtonProps={{
        //           "aria-label": "change date",
        //         }}
        //       />
        //     </MuiPickersUtilsProvider>
        //   ),
        // },
        {
          title: "Phone No",
          field: "phone",
          width: "1%",
          hidden: !columnFilters["phone"].selected,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Study material Sent",
          field: "studyMaterialSent",
          type: "boolean",
          width: "1%",
          hidden: !columnFilters["studyMaterialSent"].selected,
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
    }
  }, [columnFilters]);

  useEffect(() => {
    getSettings(isAutheticated()._id).then((data) => {
      let settings;
      if (data.data.result.columns) {
        settings = data.data.result.columns;
      } else {
        settings = [];
      }
      setColumnFilters({
        classStatusId: {
          selected: settings.includes("classStatusId"),
          name: "Customer Status",
        },
        timeZoneId: {
          selected: settings.includes("timeZoneId"),
          name: "Time Zone",
        },
        categoryId: {
          selected: settings.includes("categoryId"),
          name: "Category",
        },
        firstName: {
          selected: settings.includes("firstName"),
          name: "Student Name",
        },
        lastName: { selected: settings.includes("lastName"), name: "Gaurdian" },
        classId: { selected: settings.includes("classId"), name: "ClassName" },
        email: { selected: settings.includes("email"), name: "Email" },
        gender: { selected: settings.includes("gender"), name: "Gender" },
        whatsAppnumber: {
          selected: settings.includes("whatsAppnumber"),
          name: "Whatsapp",
        },
        oneToOne: { selected: settings.includes("oneToOne"), name: "Group" },
        teacherId: {
          selected: settings.includes("teacherId"),
          name: "Teacher",
        },
        countryId: {
          selected: settings.includes("countryId"),
          name: "Country",
        },
        numberOfStudents: {
          selected: settings.includes("numberOfStudents"),
          name: "No of Students",
        },
        proposedAmount: {
          selected: settings.includes("proposedAmount"),
          name: "Proposed Amount",
        },
        proposedCurrencyId: {
          selected: settings.includes("proposedCurrencyId"),
          name: "Proposed Currency",
        },
        placeOfStay: {
          selected: settings.includes("placeOfStay"),
          name: "Place Of Stay",
        },
        age: {
          selected: settings.includes("age"),
          name: "Age",
        },
        agentId: { selected: settings.includes("agentId"), name: "Agent Id" },
        scheduleDescription: {
          selected: settings.includes("scheduleDescription"),
          name: "scheduleDescription",
        },
        meetingLink: {
          selected: settings.includes("meetingLink"),
          name: "Meeting Link",
        },
        phone: { selected: settings.includes("phone"), name: "Phone No" },
        studyMaterialSent: {
          selected: settings.includes("studyMaterialSent"),
          name: "Study Material Sent",
        },
      });
    });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllCustomerDetails();
      let details = data.data.result;
      setData(details);
      setLoading(false);
    } catch (error) {
      console.error(error);
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
      <ColumnFilterDrawer
        classes={classes}
        drawerOpen={drawerOpen}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        setDrawerOpen={setDrawerOpen}
      />
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
            maxWidth: width,
            padding: "20px",
          }}
          isLoading={loading}
          title="Customer data"
          columns={columns}
          data={data}
          options={{
            paging: false,
            actionsColumnIndex: 0,
            addRowPosition: "first",
            maxBodyHeight: height,
            grouping: true,
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? "#3F51B5" : "#FFF",
              color: selectedRow === rowData.tableData.id ? "#fff" : "#000",
            }),
          }}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          actions={[
            (rowData) => ({
              icon: () => (
                <SmsOutlinedIcon
                  style={{
                    color:
                      selectedRow === rowData.tableData.id ? "#fff" : "#3f51B5",
                  }}
                />
              ),
              tooltip: "Add comment",
              onClick: (event, rowData) => {
                setOpen(true);
                setName(rowData.firstName);
                setId(rowData._id);
              },
            }),
            {
              icon: () => <TableChartOutlinedIcon />,
              tooltip: "Filter Columns",
              isFreeAction: true,
              onClick: (event) => setDrawerOpen(true),
            },
          ]}
          components={{
            Row: (props) => (
              <MTableBodyRow
                {...props}
                onDoubleClick={(e) => {
                  props.actions[3]().onClick(e, props.data);
                }}
              />
            ),
          }}
          editable={{
            onRowAdd: (newData) => {
              return AddCustomer(newData)
                .then((fetchedData) => {
                  if (fetchedData.data.status === "OK") {
                    setData([fetchedData.data.result, ...data]);
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
                  console.error(err, err.response);
                  setSuccess(false);
                  if (err.response && err.response.error) {
                    setResponse(err.response.error);
                  } else {
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
                    setData([...dataUpdate]);
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
              deleteUser(oldData._id)
                .then((res) => {
                  const dataDelete = [...data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setData([...dataDelete]);
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

      <Dialog
        open={open}
        fullScreen
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              See all {name}'s Comments here
            </Typography>
            <Button autoFocus color="inherit" onClick={() => setOpen(false)}>
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
