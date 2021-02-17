import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card } from "@material-ui/core/";
import axios from "axios";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
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
const Statistics = () => {
  const classes = useStyles();

  const [statisticsData, setStatisticsData] = useState();

  const [todayDay, setTodayDay] = useState();
  const [hourQueryString, setHourQueryString] = useState();
  const [amorpm, setAmorpm] = useState();
  const [todatDate, setTodatDate] = useState();

  useEffect(() => {
    convertTZ();
    fetchStatisticsData();
  }, [todayDay]);

  function convertTZ() {
    let date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    setTodayDay(moment(date).format("dddd").toUpperCase());
    setHourQueryString(moment(date).format("hh"));
    setAmorpm(moment(date).format("A"));

    setTodatDate(moment(date).format("DD-MM-YYYY"));
  }

  const fetchStatisticsData = async () => {
    try {
      let slotQueryString = `${todayDay}-${hourQueryString}:00 ${amorpm}-${hourQueryString}:30 ${amorpm}`;
      if (todayDay) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}/customer/class/dashboard?date=${todatDate}&slot=${slotQueryString}`
        );

        setStatisticsData(res && res.data);
        console.log(res);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      {statisticsData && (
        <div>
          <Grid container style={{ margin: "0 auto", width: "90%" }}>
            <Grid item xs={12} md={6}>
              <div>
                <h1 className={classes.titleCard}>
                  No Of Classes for In Classes Status
                </h1>
              </div>
              <Grid container style={{ display: "flex", flexDirection: "row" }}>
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
              <Grid container style={{ display: "flex", flexDirection: "row" }}>
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

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div>
                <h1 className={classes.titleCard}>
                  Students who are absent consecutively more than 1 day
                </h1>

                <Card
                  style={{
                    width: "100%",
                    height: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <h3>Ram - 2 days</h3>
                  <h3>Ram - 2 days</h3>
                  <h3>Ram - 2 days</h3>
                </Card>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <h1 className={classes.titleCard}>
                Class Live Dashboard Now : {todayDay} {hourQueryString}:00{" "}
                {amorpm}
              </h1>
            </div>
            <Grid
              container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {statisticsData &&
              statisticsData.schedulesRightNow.length === 0 ? (
                <p
                  style={{
                    color: "#e74c3c",
                  }}
                >
                  No classes found
                </p>
              ) : (
                statisticsData.schedulesRightNow.map((data) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={2}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <a href={data.meetingLink}>
                        <Card
                          className={classes.card}
                          style={{
                            backgroundColor: data.isTeacherJoined
                              ? "#2ecc71"
                              : "#f39c12",
                          }}
                        >
                          <p
                            style={{
                              color: "white",
                            }}
                          >
                            {data.className}
                          </p>

                          <p
                            style={{
                              color: "white",
                              fontSize: "10px",
                            }}
                          >
                            {data.scheduleDescription}
                          </p>
                        </Card>
                      </a>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>

          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <h1 className={classes.titleCard}>
                Next Classes
                {amorpm}
              </h1>
            </div>
            <Grid
              container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {statisticsData && statisticsData.nextSchedules.length === 0 ? (
                <p
                  style={{
                    color: "#e74c3c",
                  }}
                >
                  No classes found
                </p>
              ) : (
                statisticsData.nextSchedules.map((data) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      sm={2}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <a href={data.meetingLink}>
                        <Card
                          className={classes.card}
                          style={{
                            backgroundColor: "#ecf0f1",
                          }}
                        >
                          <p
                            style={{
                              color: "black",
                            }}
                          >
                            {data.className}
                          </p>

                          <p
                            style={{
                              color: "black",
                              fontSize: "10px",
                            }}
                          >
                            {data.scheduleDescription}
                          </p>
                        </Card>
                      </a>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default Statistics;
