import React, { useEffect, useState } from "react";
import MaterialTable, { MTableBodyRow, MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import useWindowDimensions from "../../../Components/useWindowDimensions";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import moment from "moment";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
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
  Switch,
  Card,
  Grid,
} from "@material-ui/core";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import CloseIcon from "@material-ui/icons/Close";
import Comments from "./Comments";
import "date-fns";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import Drawer from "@material-ui/core/Drawer";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isAutheticated } from "../../../auth";
import { getSettings, updateSettings } from "../../../Services/Services";
import axios from "axios";

const copyToClipboard = (text) => {
  var textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
};

const getSlotFromTime = (date) => {
  let daysarr = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  let newDate = new Date(date);
  let dayToday = newDate.getDay();
  let hoursRightNow = newDate.getHours();
  let minutesRightNow = newDate.getMinutes();
  let secondsRightNow = newDate.getSeconds();
  let isAm = hoursRightNow < 12;
  hoursRightNow = !isAm ? hoursRightNow - 12 : hoursRightNow;
  let is30 = minutesRightNow > 30;
  let secondsLeft =
    (is30 ? 59 - minutesRightNow : 29 - minutesRightNow) * 60 +
    (60 - secondsRightNow);
  if ((hoursRightNow === 11) & is30) {
    return {
      slot: `${daysarr[dayToday]}-11:30 ${isAm ? "AM" : "PM"}-12:00 ${
        !isAm ? "AM" : "PM"
      }`,
      secondsLeft,
    };
  } else if (hoursRightNow === 12 && is30) {
    return {
      slot: `${daysarr[dayToday]}-12:30 ${isAm ? "AM" : "PM"}-01:00 ${
        isAm ? "AM" : "PM"
      }`,
      secondsLeft,
    };
  } else {
    return {
      slot: `${daysarr[dayToday]}-${hoursRightNow}${is30 ? ":30" : ":00"} ${
        isAm ? "AM" : "PM"
      }-${is30 ? hoursRightNow + 1 : hoursRightNow}${is30 ? ":00" : ":30"} ${
        isAm ? "AM" : "PM"
      }`,
      secondsLeft,
    };
  }
};

const names = [
  "Class",
  "Time Zone",
  "Class Status",
  "Currency",
  "Country",
  "Teacher",
  "Agent",
  "Category",
  "Subject",
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
  "subjectName",
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
  card: {
    width: 150,
    height: 100,
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "center",
  },
  titleCard: {
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "10px",
    marginTop: "10px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [classDropdown, setClassDropdown] = useState({});
  const [timeZoneDropdown, setTimeZoneDropdown] = useState({});
  const [classStatusDropdown, setClassStatusDropdown] = useState({});
  const [currencyDropdown, setCurrencyDropdown] = useState({});
  const [countryDropdown, setCountryDropdown] = useState({});
  const [teachersDropdown, setTeachersDropdown] = useState({});
  const [agentDropdown, setAgentDropdown] = useState({});
  const [categoryDropdown, setCategoryDropdown] = useState({});
  const [subjectDropdown, setSubjectDropdown] = useState({});
  const [dropDownFilters, setDropDownFilters] = useState({});
  const [toolbarFilteredData, setToolbarFilteredData] = useState();
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    getSettings(isAutheticated()._id).then((data) => {
      let settings;
      if (data.data.result.columns) {
        settings = data.data.result.columns;
      } else {
        settings = [];
      }
      if (data.data.result.dropDownFilters) {
        setDropDownFilters(data.data.result.dropDownFilters);
      } else {
        setDropDownFilters({
          classStatus: [],
          timeZone: [],
          class: [],
          teacher: [],
          country: [],
        });
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
        className: {
          selected: settings.includes("className"),
          name: "new Class Name",
        },
        subjectId: {
          selected: settings.includes("subjectId"),
          name: "Subject name",
        },
        lastName: { selected: settings.includes("lastName"), name: "Gaurdian" },
        classId: { selected: settings.includes("classId"), name: "Class Name" },
        email: { selected: settings.includes("email"), name: "Email" },
        gender: { selected: settings.includes("gender"), name: "Gender" },
        whatsAppnumber: {
          selected: settings.includes("whatsAppnumber"),
          name: "Whatsapp",
        },
        noOfClasses: {
          selected: settings.includes("noOfClasses"),
          name: "Number of Classes",
        },
        paymentDate: {
          selected: settings.includes("paymentDate"),
          name: "Payment Date",
        },
        oneToOne: { selected: settings.includes("oneToOne"), name: "Group" },
        numberOfClassesBought: {
          selected: settings.includes("numberOfClassesBought"),
          name: "Classes paid",
        },
        paidTill: {
          selected: settings.includes("paidTill"),
          name: "Paid Till",
        },
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
        createdAt: {
          selected: settings.includes("createdAt"),
          name: "Joining Date",
        },
      });
    });
    fetchData();
  }, []);

  const toggleJoinButton = async (rowData) => {
    try {
      await editCustomer({
        isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
        _id: rowData._id,
      });
      setData((prev) => {
        let index = rowData.tableData.id;
        let prevData = [...prev];
        prevData[index] = {
          ...rowData,
          isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
        };
        return prevData;
      });
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setResponse("Error in toggling Join Button");
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    setClassDropdown(fetchDropDown(0));
    setTimeZoneDropdown(fetchDropDown(1));
    setClassStatusDropdown(fetchDropDown(2));
    setCurrencyDropdown(fetchDropDown(3));
    setCountryDropdown(fetchDropDown(4));
    setTeachersDropdown(fetchDropDown(5));
    setAgentDropdown(fetchDropDown(6));
    setCategoryDropdown(fetchDropDown(7));
    setSubjectDropdown(fetchDropDown(8));
  }, []);

  useEffect(() => {
    if (Object.keys(columnFilters).length) {
      setColumns([
        {
          title: "Toggle Class Join",
          width: "1%",
          align: "center",
          editable: "never",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          field: "isJoinButtonEnabledByAdmin",
          render: (rowData) => (
            <Switch
              onChange={() => toggleJoinButton(rowData)}
              checked={rowData.isJoinButtonEnabledByAdmin}
              name="isJoinButtonEnabledByAdmin"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          ),
        },
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
          title: "Paid Till (DD-MM-YYYY) ",
          field: "paidTill",
          width: "1%",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["paidTill"].selected,
        },
        {
          title: "Classes Paid",
          field: "numberOfClassesBought",
          type: "numeric",
          width: "1%",
          hidden: !columnFilters["numberOfClassesBought"].selected,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Number of Classes",
          field: "noOfClasses",
          type: "numeric",
          width: "1%",
          hidden: !columnFilters["noOfClasses"].selected,
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
          title: "Payment Date",
          field: "paymentDate",
          width: "1%",
          lookup: Array.from(
            { length: 31 },
            (_, i) => i
          ).reduce((prev, cur) => ({ ...prev, [cur]: cur })),
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["paymentDate"].selected,
          render: (rowData) =>
            rowData.paymentDate ? `${rowData.paymentDate} of every month` : "",
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
          title: "Subject Name",
          field: "subjectId",
          width: "1%",
          lookup: subjectDropdown,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
          hidden: !columnFilters["subjectId"].selected,
        },
        {
          title: "New Class Name",
          field: "className",
          hidden: !columnFilters["className"].selected,
          width: "1%",
          editable: "never",
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
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
          hidden: !columnFilters["scheduleDescription"].selected,
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
        {
          title: "Meeting Link",
          field: "meetingLink",
          hidden: !columnFilters["meetingLink"].selected,
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
        {
          title: "Phone No",
          field: "phone",
          width: "1%",
          hidden: !columnFilters["phone"].selected,
          cellStyle: { whiteSpace: "nowrap" },
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "Joining Date",
          field: "createdAt",
          width: "1%",
          type: "date",
          editable: "never",
          hidden: !columnFilters["createdAt"].selected,
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
  }, [
    columnFilters,
    classDropdown,
    timeZoneDropdown,
    classStatusDropdown,
    currencyDropdown,
    countryDropdown,
    teachersDropdown,
    agentDropdown,
    categoryDropdown,
    subjectDropdown,
  ]);

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

  const [statisticsData, setStatisticsData] = useState();
  useEffect(() => {
    getStatistics();
  }, []);

  const getStatistics = async () => {
    try {
      let date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const { slot } = getSlotFromTime(date);
      let formattedDate = moment(date).format("DD-MM-YYYY");
      const res = await axios.get(
        `${process.env.REACT_APP_API_KEY}/customer/class/dashboard?date=${formattedDate}&slot=${slot}`
      );

      setStatisticsData(res && res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [filteredDataBTN, setFilteredDataBTN] = useState();
  const [applyFilerBool, setApplyFilerBool] = useState(false);
  const filterDatabtn = () => {
    let newArray = [];

    // if (toolbarFilteredData.filerName === "classStatus") {
    //   newArray = data.filter((el) => {
    //     if (el.classStatusId === toolbarFilteredData.data[0].id) {
    //       // newArray.push(el);
    //     }
    //   });
    // }
    // if (toolbarFilteredData.filerName === "timeZone") {
    //   newArray = data.filter((el) => {
    //     if (el.timeZoneId === toolbarFilteredData.data[0].id) {
    //       // newArray.push(el);
    //     }
    //   });
    // }
    // if (toolbarFilteredData.filerName === "class") {
    //   newArray = data.filter((el) => {
    //     if (el.classId === toolbarFilteredData.data[0].id) {
    //       // newArray.push(el);
    //     }
    //   });
    // }
    // if (toolbarFilteredData.filerName === "teacher") {
    //   newArray = data.filter((el) => {
    //     if (el.teacherId === toolbarFilteredData.data[0].id) {
    //       // newArray.push(el);
    //     }
    //   });
    // }
    // if (toolbarFilteredData.filerName === "country") {
    //   newArray = data.filter((el) => {
    //     if (el.countryId === toolbarFilteredData.data[0].id) {
    //       // newArray.push(el);
    //     }
    //   });
    // }

    // setData(newArray);
    setApplyFilerBool(true);
    var id_filter = [toolbarFilteredData.data[0].id];
    var filtered = data.filter(function (item) {
      if (toolbarFilteredData.filerName === "classStatus") {
        return id_filter.indexOf(item.classStatusId) !== -1;
      }
      if (toolbarFilteredData.filerName === "timeZone") {
        return id_filter.indexOf(item.timeZoneId) !== -1;
      }
    });
    setFilteredDataBTN(filtered);
  };

  console.log(toolbarFilteredData);
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
        {statisticsOpen && statisticsData && (
          <div style={{ backgroundColor: "white" }}>
            <Grid container style={{ margin: "0 auto", width: "90%" }}>
              <Grid item xs={12} md={6}>
                <div>
                  <h1 className={classes.titleCard}>
                    No Of Classes for In Classes Status
                  </h1>
                </div>
                <Grid
                  container
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#e74c3c" }}
                    >
                      <h2>{"<-2"}</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.customersLessThanMinus2}
                      </h1>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#e67e22" }}
                    >
                      <h2>{"<-1"}</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.customersEqualToMinus1}
                      </h1>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#2ecc71" }}
                    >
                      <h2>{"0"}</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.customersEqualTo0}
                      </h1>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <div>
                  <h1 className={classes.titleCard}>
                    No Of Classes for In Classes Status
                  </h1>
                </div>
                <Grid
                  container
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#d35400" }}
                    >
                      <h2>New</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.newCustomers}
                      </h1>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#3498db" }}
                    >
                      <h2>Demo</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.demoCustomers}
                      </h1>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Card
                      className={classes.card}
                      style={{ backgroundColor: "#27ae60" }}
                    >
                      <h2>InClass</h2>
                      <h1 style={{ color: "white" }}>
                        {statisticsData.customersInClass}
                      </h1>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}

        <MaterialTable
          stickyHeader
          style={{
            maxWidth: width,
            padding: "20px",
          }}
          isLoading={loading}
          title="Customer data"
          columns={columns}
          data={applyFilerBool ? filteredDataBTN : data}
          options={{
            pageSize: 20,
            pageSizeOptions: [20, 30, 40, 50, data.length],
            paginationType: "stepped",
            searchFieldVariant: "outlined",
            actionsColumnIndex: 0,
            addRowPosition: "first",
            maxBodyHeight: height - 300,
            grouping: true,
            exportButton: true,
            rowStyle: (rowData) => ({
              backgroundColor: "#FFF",
              color: "#000",
            }),
          }}
          actions={[
            (rowData) => ({
              icon: () => (
                <SmsOutlinedIcon
                  style={{
                    color: "#3f51B5",
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
            {
              icon: () => <EqualizerIcon />,
              tooltip: "Statistics",
              isFreeAction: true,
              onClick: (event) => setStatisticsOpen(!statisticsOpen),
            },
          ]}
          components={{
            Row: (props) => (
              <MTableBodyRow
                {...props}
                onDoubleClick={(e) => {
                  props.actions[4]().onClick(e, props.data);
                }}
              />
            ),
            Toolbar: (props) => (
              <div>
                <MTableToolbar {...props} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {[
                    classStatusDropdown,
                    timeZoneDropdown,
                    classDropdown,
                    teachersDropdown,
                    countryDropdown,
                  ].map((dropdown, i) => (
                    <div
                      style={{
                        width: "16%",
                        margin: "6px",
                        boxSizing: "border-box",
                      }}
                    >
                      <Autocomplete
                        multiple
                        size="small"
                        id="tags-standard"
                        options={Object.keys(dropdown).map((id) => ({
                          id,
                          name: dropdown[id],
                        }))}
                        value={
                          dropDownFilters[
                            [
                              "classStatus",
                              "timeZone",
                              "class",
                              "teacher",
                              "country",
                            ][i]
                          ]
                        }
                        onChange={(e, arr) => {
                          setToolbarFilteredData({
                            filerName: [
                              "classStatus",
                              "timeZone",
                              "class",
                              "teacher",
                              "country",
                            ][i],
                            data: arr,
                          });
                        }}
                        limitTags={1}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={
                              [
                                "Class Status",
                                "Time Zone",
                                "Class",
                                "Teacher",
                                "Country",
                              ][i]
                            }
                          />
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: "5px" }}
                    // onClick={filterDatabtn}
                  >
                    Apply Filter
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: "5px" }}
                    // onClick={() => setApplyFilerBool(false)}
                  >
                    Clear Filter
                  </Button>
                </div>
              </div>
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
              let requestBody = {};
              Object.keys(newData).forEach((key) => {
                if (!(newData[key] === oldData[key])) {
                  requestBody[key] = newData[key];
                }
              });
              if (
                !Object.keys(requestBody).includes("numberOfClassesBought") ||
                window.confirm("Are you sure in updating Classes paid")
              ) {
                return editCustomer({ ...requestBody, _id: oldData._id })
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
              } else {
                return new Promise((resolutionFunc, rejectionFunc) => {
                  rejectionFunc(null);
                }).catch((err) => {
                  setSuccess(false);
                  setResponse("Customer not updated");
                  setSnackBarOpen(true);
                });
              }
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
        fullWidth
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
