import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import HotelIcon from "@material-ui/icons/Hotel";
import RepeatIcon from "@material-ui/icons/Repeat";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import ClearIcon from "@material-ui/icons/Clear";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function TimelineTrx({ data }) {
  const classes = useStyles();
  return (
    <>
      <Timeline align="alternate">
        {data &&
          data.data.result.map((dataa) => {
            if (dataa.paymentData !== null) {
              return (
                <TimelineItem style={{ marginTop: 30 }}>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      {moment(dataa.createdAt).format("MMM Do YYYY h:mm A")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot style={{ backgroundColor: "#27ae60" }}>
                      <CheckCircleIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        style={{ marginTop: 10 }}
                      >
                        {dataa.customerId.firstName}{" "}
                        {dataa.customerId.lastName && dataa.customerId.lastName}
                      </Typography>
                      <Typography style={{ fontSize: 14, marginTop: 10 }}>
                        {dataa.paymentData.id}
                      </Typography>
                      <Typography style={{ fontSize: 14, marginTop: 10 }}>
                        Amount Paid:{" "}
                        {dataa.paymentData.transactions[0].amount.total}{" "}
                        {dataa.paymentData.transactions[0].amount.currency}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              );
            } else {
              return (
                <TimelineItem style={{ marginTop: 30 }}>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      {moment(dataa.createdAt).format("MMM Do YYYY h:mm A")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot style={{ backgroundColor: "#c0392b" }}>
                      <ClearIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        style={{ marginTop: 10 }}
                      >
                        Transaction Id
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h1"
                        style={{ marginTop: 10 }}
                      >
                        {dataa._id}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              );
            }
          })}
      </Timeline>
    </>
  );
}
