import { Card, Grid } from "@material-ui/core";
import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

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
    width: 50,
    height: 50,
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

  h1umber: {
    color: "white",
    fontSize: 18,
  },
  h2Text: {
    fontSize: 12,
  },
}));

const StatisticsCards = () => {
  const classes = useStyles();
  const [statisticsData, setStatisticsData] = useState();

  useEffect(() => {
    getStatistics();
  }, []);

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

  const getStatistics = async () => {
    try {
      let date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const { slot } = getSlotFromTime(date);
      let formattedDate = moment(date).format("DD-MM-YYYY");
      const res = await Axios.get(
        `${process.env.REACT_APP_API_KEY}/customer/class/dashboard?date=${formattedDate}&slot=${slot}`
      );

      setStatisticsData(res && res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {statisticsData && (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#e74c3c" }}
              >
                <h2 className={classes.h2Text}>{"-Two"}</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.customersLessThanMinus2}
                </h1>
              </Card>
            </Grid>
            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#e67e22" }}
              >
                <h2 className={classes.h2Text}>{"-One"}</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.customersEqualToMinus1}
                </h1>
              </Card>
            </Grid>
            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#2ecc71" }}
              >
                <h2 className={classes.h2Text}>{"Zero"}</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.customersEqualTo0}
                </h1>
              </Card>
            </Grid>

            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#d35400" }}
              >
                <h2 className={classes.h2Text}>New</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.newCustomers}
                </h1>
              </Card>
            </Grid>
            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#3498db" }}
              >
                <h2 className={classes.h2Text}>Demo</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.demoCustomers}
                </h1>
              </Card>
            </Grid>
            <Grid item xs={2}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#27ae60" }}
              >
                <h2 className={classes.h2Text}>InClass</h2>
                <h1 className={classes.h1umber}>
                  {statisticsData.customersInClass}
                </h1>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default StatisticsCards;
