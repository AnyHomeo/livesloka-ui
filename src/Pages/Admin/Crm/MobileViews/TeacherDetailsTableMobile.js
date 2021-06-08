import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { CircularProgress, IconButton, Snackbar } from "@material-ui/core";
import { Edit, Trash2 } from "react-feather";
import { getData, updateLeave } from "../../../../Services/Services";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    margin: "0 auto",
    marginTop: 5,
    marginBottom: 5,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: 20,
  },
  expanded: {},
  content: {
    "&$expanded": {
      marginBottom: 0,
      display: "flex",
      justifyContent: "space-between",
    },
  },
  subTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  noStudent: {
    fontSize: 14,
    opacity: 0.8,
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  subInfo: {
    opacity: 0.8,
  },
}));

const TeacherDetailsTableMobile = ({ data, categoryData, statusData }) => {
  const classes = useStyles();

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  const [editableDate, setEditableDate] = useState(false);

  const [selectedDate, setSelectedDate] = React.useState(data.cancelledDate);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onSubmitData = async () => {
    setLoading(true);

    setLoading(false);
  };
  return (
    <div className={classes.root}>
      {data && (
        <Accordion>
          <AccordionSummary
            classes={{ content: classes.content, expanded: classes.expanded }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography className={classes.heading}>
                {data?.TeacherName}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className={classes.flexContainer}></div>

              <div style={{ marginTop: 5 }}>
                <p className={classes.subTitle}>
                  Desc:{" "}
                  <span className={classes.subInfo}>{data.TeacherDesc}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Status:{" "}
                  {statusData &&
                    statusData?.data?.result?.map((cat) => {
                      if (cat.statusId === data.TeacherStatus) {
                        return (
                          <span className={classes.subInfo}>
                            {cat.statusName}
                          </span>
                        );
                      }
                    })}
                </p>

                <p className={classes.subTitle}>
                  Category:{" "}
                  {categoryData &&
                    categoryData?.data?.result?.map((cat) => {
                      if (cat.id === data.category) {
                        return (
                          <span className={classes.subInfo}>
                            {cat.categoryName}
                          </span>
                        );
                      }
                    })}
                </p>

                <p className={classes.subTitle}>
                  Mail:{" "}
                  <span className={classes.subInfo}>{data.teacherMail}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Salary Till Now:{" "}
                  <span className={classes.subInfo}>{data.Salary_tillNow}</span>{" "}
                </p>
                <p className={classes.subTitle}>
                  Commission Amount One:{" "}
                  <span className={classes.subInfo}>
                    {data.Commission_Amount_One}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Commission Amount Many:{" "}
                  <span className={classes.subInfo}>
                    {data.Commission_Amount_Many}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Bank:{" "}
                  <span className={classes.subInfo}>{data.Bank_account}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Phone:{" "}
                  <span className={classes.subInfo}>{data.Phone_number}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Bank Full Name:{" "}
                  <span className={classes.subInfo}>{data.Bank_full_name}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Include Demo Class In Salaries:{" "}
                  <span className={classes.subInfo}>
                    {data.isDemoIncludedInSalaries}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Leave Difference Hours:{" "}
                  <span className={classes.subInfo}>
                    {data.leaveDifferenceHours}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>Teacher Image: </p>
                <img
                  style={{
                    height: 60,
                    width: 60,
                    objectFit: "contain",
                    display: "block",
                  }}
                  src={data.teacherImageLink}
                  alt=""
                />
                <IconButton onClick={() => setEditableDate(true)}>
                  <Edit style={{ marginRight: 10, color: "#34495e" }} />
                  <Trash2 style={{ color: "#e74c3c" }} />
                </IconButton>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      )}

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
    </div>
  );
};

export default TeacherDetailsTableMobile;
