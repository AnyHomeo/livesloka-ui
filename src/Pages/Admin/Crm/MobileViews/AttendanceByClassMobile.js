import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import { Chip, IconButton } from "@material-ui/core";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "0 auto",
    marginTop: 5,
    marginBottom: 5
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
}));

const AttendanceByClassMobile = ({ data }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
              {moment(data.date, "YYYY-MM-DD").format("MMMM Do YYYY")}
            </Typography>
            <Typography className={classes.heading}>{data.time}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className={classes.flexContainer}>
              <p className={classes.subTitle}>Attended:</p>{" "}
              {data.customers.length === 0 && (
                <p className={classes.noStudent}>No students</p>
              )}
              {data.customers.map((student) => (
                <Chip
                  key={student._id}
                  style={{
                    margin: "0 5px",
                    marginBottom: 5,
                    backgroundColor: "#2ecc704d",
                    border: "1px solid #27ae60",
                    color: "#27ae60",
                    // fontWeight: "bold",
                  }}
                  label={
                    student.firstName
                      ? student.firstName
                      : student.email
                      ? student.email
                      : "Noname"
                  }
                  size="small"
                />
              ))}
            </div>
            <div className={classes.flexContainer}>
              <p className={classes.subTitle}>Requested:</p>{" "}
              {data.requestedStudents.length === 0 && (
                <p className={classes.noStudent}>No students</p>
              )}
              {data.requestedStudents.map((student) => (
                <Chip
                  key={student._id}
                  style={{
                    margin: "0 5px",
                    marginBottom: 5,
                    backgroundColor: "#f1c40f63",
                    border: "1px solid #f39c12",
                    color: "#f39c12",
                    // fontWeight: "bold",
                  }}
                  label={
                    student.firstName
                      ? student.firstName
                      : student.email
                      ? student.email
                      : "Noname"
                  }
                  size="small"
                />
              ))}
            </div>
            <div className={classes.flexContainer}>
              <p className={classes.subTitle}>Requested Paid:</p>
              {data.requestedPaidStudents.length === 0 && (
                <p className={classes.noStudent}>No students</p>
              )}
              {data.requestedPaidStudents.map((student) => (
                <Chip
                  key={student._id}
                  style={{
                    margin: "0 5px",
                    marginBottom: 5,
                    backgroundColor: "#e74c3c4d",
                    border: "1px solid #c0392b",
                    color: "#c0392b",
                    // fontWeight: "bold",
                  }}
                  label={
                    student.firstName
                      ? student.firstName
                      : student.email
                      ? student.email
                      : "Noname"
                  }
                  size="small"
                />
              ))}
            </div>
            <div className={classes.flexContainer}>
              <p className={classes.subTitle}>Absent:</p>{" "}
              {data.absentees.length === 0 && (
                <p className={classes.noStudent}>No students</p>
              )}
              {data.absentees.map((student) => (
                <Chip
                  key={student._id}
                  style={{
                    margin: "0 5px",
                    marginBottom: 5,
                    backgroundColor: "#e74c3c4d",
                    border: "1px solid #c0392b",
                    color: "#c0392b",
                    // fontWeight: "bold",
                  }}
                  label={
                    student.firstName
                      ? student.firstName
                      : student.email
                      ? student.email
                      : "Noname"
                  }
                  size="small"
                />
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <p>Actions:</p>

              <Link
                to={`/edit/attendance/${data.scheduleId}/${data.date}`}
                style={{ textDecoration: "none" }}
              >
                <IconButton>
                  <Edit />
                </IconButton>
              </Link>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AttendanceByClassMobile;
