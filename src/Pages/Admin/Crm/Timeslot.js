import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { CardActionArea } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    margin: "0 auto",
    width: "95vw",
    marginTop: "30px",
  },
  cardWidth: {
    display: "block",
    margin: "0 auto",
    width: "95%",
    marginTop: "30px",
  },
  media: {
    height: 140,
  },

  container: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

const TimeCard = ({ time }) => (
  <Card
    style={{
      width: "150px",
      backgroundColor: ![
        "12:00 AM - 12:30 AM",
        "03:00 AM - 03:30 AM",
        "07:30 AM - 08:00 AM",
        "08:30 AM - 09:00 AM",
        "10:00 PM - 10:30 PM",
        "01:00 PM - 01:30 PM",
        "08:30 PM - 09:00 PM",
      ].includes(time)
        ? [
            "08:00 AM - 08:30 AM",
            "04:00 PM - 04:30 PM",
            "09:00 PM - 09:30 PM",
          ].includes(time)
          ? "#3F51B5"
          : "#FFF"
        : "#1dd1a1",
      margin: "20px",
    }}
  >
    <CardActionArea>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          padding: "10px",
          fontsize: "20px",
          color: ![
            "12:00 AM - 12:30 AM",
            "03:00 AM - 03:30 AM",
            "07:30 AM - 08:00 AM",
            "08:30 AM - 09:00 AM",
            "10:00 PM - 10:30 PM",
            "01:00 PM - 01:30 PM",
            "08:30 PM - 09:00 PM",
            "08:00 AM - 08:30 AM",
            "04:00 PM - 04:30 PM",
            "09:00 PM - 09:30 PM",
          ].includes(time)
            ? "#000"
            : "#fff",
        }}
      >
        {time}
      </p>
    </CardActionArea>
  </Card>
);

function MediaCard() {
  const times = [
    "12:00 AM - 12:30 AM",
    "12:30 AM - 01:00 AM",
    "01:00 AM - 01:30 AM",
    "01:30 AM - 02:00 AM",
    "02:00 AM - 02:30 AM",
    "02:30 AM - 03:00 AM",
    "03:00 AM - 03:30 AM",
    "03:30 AM - 04:00 AM",
    "04:00 AM - 04:30 AM",
    "04:30 AM - 05:00 AM",
    "05:00 AM - 05:30 AM",
    "05:30 AM - 06:00 AM",
    "06:00 AM - 06:30 AM",
    "06:30 AM - 07:00 AM",
    "07:00 AM - 07:30 AM",
    "07:30 AM - 08:00 AM",
    "08:00 AM - 08:30 AM",
    "08:30 AM - 09:00 AM",
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "12:30 PM - 01:00 PM",
    "01:00 PM - 01:30 PM",
    "01:30 PM - 02:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM",
    "06:00 PM - 06:30 PM",
    "06:30 PM - 07:00 PM",
    "07:00 PM - 07:30 PM",
    "07:30 PM - 08:00 PM",
    "08:00 PM - 08:30 PM",
    "08:30 PM - 09:00 PM",
    "09:00 PM - 09:30 PM",
    "09:30 PM - 10:00 PM",
    "10:00 PM - 10:30 PM",
    "10:30 PM - 11:00 PM",
    "11:00 PM - 11:30 PM",
    "11:30 PM - 12:00 PM",
  ];
  return (
    <>
      <Card>
        <h3 style={{ textAlign: "center" }}>Select Available Time Slots</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {times.map((time) => (
            <TimeCard time={time} key={time} />
          ))}
        </div>
      </Card>
    </>
  );
}

function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Monday" {...a11yProps(0)} />
        <Tab label="Tuesday" {...a11yProps(1)} />
        <Tab label="Wednesday" {...a11yProps(2)} />
        <Tab label="Thursday" {...a11yProps(3)} />
        <Tab label="Friday" {...a11yProps(4)} />
        <Tab label="Saturday" {...a11yProps(5)} />
        <Tab label="Sunday" {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <MediaCard />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <MediaCard />
      </TabPanel>
    </div>
  );
}

const Timeslot = () => {
  const [teacher, setTeacher] = useState("");

  return (
    <div>
      <div
        style={{
          display: "block",
          margin: "0 auto",
          width: 200,
          marginTop: "30px",
        }}
      >
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <InputLabel id="demo-simple-select-outlined-label">
            Select Teacher
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            label="Select Teacher"
          >
            <MenuItem value={10}>Teacher 1</MenuItem>
            <MenuItem value={20}>Teacher 2</MenuItem>
            <MenuItem value={30}>Teacher 3</MenuItem>
          </Select>
        </FormControl>
      </div>

      <ScrollableTabsButtonAuto />
    </div>
  );
};

export default Timeslot;
