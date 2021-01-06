import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import useWindowDimensions from "../../Components/useWindowDimensions";
import { getSchedulesByDayForZoomAccountDashboard } from "../../Services/Services";
const times = [
  "12:00 AM-12:30 AM",
  "12:30 AM-01:00 AM",
  "01:00 AM-01:30 AM",
  "01:30 AM-02:00 AM",
  "02:00 AM-02:30 AM",
  "02:30 AM-03:00 AM",
  "03:00 AM-03:30 AM",
  "03:30 AM-04:00 AM",
  "04:00 AM-04:30 AM",
  "04:30 AM-05:00 AM",
  "05:00 AM-05:30 AM",
  "05:30 AM-06:00 AM",
  "06:00 AM-06:30 AM",
  "06:30 AM-07:00 AM",
  "07:00 AM-07:30 AM",
  "07:30 AM-08:00 AM",
  "08:00 AM-08:30 AM",
  "08:30 AM-09:00 AM",
  "09:00 AM-09:30 AM",
  "09:30 AM-10:00 AM",
  "10:00 AM-10:30 AM",
  "10:30 AM-11:00 AM",
  "11:00 AM-11:30 AM",
  "11:30 AM-12:00 PM",
  "12:00 PM-12:30 PM",
  "12:30 PM-01:00 PM",
  "01:00 PM-01:30 PM",
  "01:30 PM-02:00 PM",
  "02:00 PM-02:30 PM",
  "02:30 PM-03:00 PM",
  "03:00 PM-03:30 PM",
  "03:30 PM-04:00 PM",
  "04:00 PM-04:30 PM",
  "04:30 PM-05:00 PM",
  "05:00 PM-05:30 PM",
  "05:30 PM-06:00 PM",
  "06:00 PM-06:30 PM",
  "06:30 PM-07:00 PM",
  "07:00 PM-07:30 PM",
  "07:30 PM-08:00 PM",
  "08:00 PM-08:30 PM",
  "08:30 PM-09:00 PM",
  "09:00 PM-09:30 PM",
  "09:30 PM-10:00 PM",
  "10:00 PM-10:30 PM",
  "10:30 PM-11:00 PM",
  "11:00 PM-11:30 PM",
  "11:30 PM-12:00 PM",
];
const hours = [
  "12 AM",
  "01 AM",
  "02 AM",
  "03 AM",
  "04 AM",
  "05 AM",
  "06 AM",
  "07 AM",
  "08 AM",
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
  "07 PM",
  "08 PM",
  "09 PM",
  "10 PM",
  "11 PM",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ZoomAccountDashboard() {
  const classes = useStyles();
  const { width } = useWindowDimensions();
  const [allDays] = useState([
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]);
  const [value, setValue] = useState(new Date().getDay());
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [schedulesOfTheDay, setSchedulesOfTheDay] = useState({});

  useEffect(() => {
    getSchedulesByDayForZoomAccountDashboard(allDays[value])
      .then((data) => {
        console.log(data.data.result);
        setSchedulesOfTheDay({
          ...data.data.result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [value]);

  return (
    <div className={classes.root}>
      <div
        style={{
          width,
          position: "fixed",
          top: "55px",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {allDays.map((day, i) => (
            <Tab label={day} key={i} {...a11yProps(i)} />
          ))}
        </Tabs>
      </div>
      {allDays.map((day, i) => (
        <TabPanel value={value} key={i} index={i}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              marginTop: "35px",
            }}
          >
            <div
              style={{
                width: width < 700 ? "10%" : "5%",
                backgroundColor: "#EAF0F1",
                marginTop: "80px",
              }}
            >
              {hours.map((hour, i) => (
                <div
                  key={i}
                  className="time-header"
                  style={{
                    height: "160px",
                  }}
                >
                  {hour}
                </div>
              ))}
            </div>
            <div
              style={{
                width: width < 700 ? "90%" : "95%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                }}
              >
                {Object.keys(schedulesOfTheDay).map((schedule, i) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        key={i}
                        style={{
                          width: "200px",
                          height: "80px",
                          textAlign: "center",
                          padding: "15px 0",
                          backgroundColor:
                            schedulesOfTheDay[schedule].color || "#EAF0F1",
                          color: "white",
                          borderLeft: "1px solid #fff",
                          boxShadow:
                            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                        }}
                      >
                        {" "}
                        {width < 700
                          ? schedule.toUpperCase().slice(0, 3) + "..."
                          : schedule.toUpperCase()}
                      </div>
                      <div
                        style={{
                          width: "200px",
                          height: "100%",
                        }}
                      >
                        {times.map((time, j) => {
                          let filteredArray = schedulesOfTheDay[
                            schedule
                          ].schedules.filter((scheduleFromArr) =>
                            scheduleFromArr.slots.includes(
                              `${day.toUpperCase()}-${time}`
                            )
                          );
                          return (
                            <div
                              style={{
                                backgroundColor: filteredArray.length
                                  ? schedulesOfTheDay[schedule].color
                                  : "white",
                                height: "80px",
                                width: "100%",
                                color: "white",
                                fontSize: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderLeft: "0.5px solid #34495ee5",
                                borderTop: "1px solid #ccc",
                                borderBottom:
                                  j % 2 !== 0
                                    ? "1px solid rgba(0,0,0,0.5)"
                                    : "",
                              }}
                            >
                              {filteredArray.map(
                                (schedule) => `${schedule.className}`
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </TabPanel>
      ))}
    </div>
  );
}
