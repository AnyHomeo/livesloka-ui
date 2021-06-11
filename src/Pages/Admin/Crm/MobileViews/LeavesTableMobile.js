import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import moment from "moment";
import { CircularProgress, IconButton, Snackbar } from "@material-ui/core";
import { Edit, ArrowRightCircle } from "react-feather";
import { updateLeave } from "../../../../Services/Services";
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

const LeavesTableMobile = ({ data, setRefresh }) => {
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
    const formData = {
      cancelledDate: selectedDate,
      className: data.className,
      firstName: data.firstName,
      lastName: data.lastName,
      _id: data._id,
    };

    try {
      const res = await updateLeave(formData);
      if (res?.status === 200) {
        setSuccess(true);
        setResponse(res?.data?.message);
        setSnackBarOpen(true);
        setEditableDate(false);
        setRefresh(true);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setSuccess(false);
        setResponse("Something went wrong,Try again later");
        setSnackBarOpen(true);
      }
    }
    setLoading(false);
  };
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
              {data.firstName} {`(${data.lastName})`}
            </Typography>

            <Typography className={classes.heading}>
              {moment(data.cancelledDate).format("MMMM Do YYYY")}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className={classes.flexContainer}></div>

            <div style={{ marginTop: 5 }}>
              <p className={classes.subTitle}>
                First Name: <span>{data.firstName}</span>{" "}
              </p>

              <p className={classes.subTitle}>
                Last Name: <span>{data.lastName}</span>{" "}
              </p>

              {editableDate ? (
                <div style={{ marginTop: 15, marginLeft: -5 }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      label="Date (Timezone)"
                      inputVariant="outlined"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              ) : (
                <p className={classes.subTitle}>
                  Date (User Timezone):{" "}
                  <span>
                    {moment(data.cancelledDate).format(
                      "MMMM Do YYYY, h:mm:ss A"
                    )}
                  </span>{" "}
                </p>
              )}

              <IconButton onClick={() => setEditableDate(true)}>
                {editableDate ? (
                  <>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <ArrowRightCircle
                        onClick={() => onSubmitData()}
                        style={{ color: "#2ecc71" }}
                      />
                    )}
                  </>
                ) : (
                  <Edit />
                )}
              </IconButton>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
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

export default LeavesTableMobile;
