import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { CardActionArea } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
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
    display: "block",
    margin: "0 auto",
    width: "75%",
    marginTop: "30px",
  },
  cardWidth: {
    display: "block",
    margin: "0 auto",
    width: "75%",
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

function MediaCard() {
  const classes = useStyles();

  const [selected, setSelected] = useState(false);

  const times = [
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
    "4:00 AM",
    "4:30 AM",
    "5:00 AM",
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 AM",
    "12:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
    "12:00 PM",
    "12:30 PM",
  ];

  const TimeCard = ({ time }) => (
    <Card
      style={{
        height: "60px",
        width: "70px",
        backgroundColor: "#1dd1a1",
        margin: "20px",
      }}
    >
      <CardActionArea>
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
            fontWeight: "bold",
            fontsize: "20px",
            color: "white",
          }}
        >
          {time}
        </p>
      </CardActionArea>
    </Card>
  );

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
  const classes = useStyles();

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
            value={age}
            onChange={handleChange}
            label="Age"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>

      <ScrollableTabsButtonAuto />
    </div>
  );
};

export default Timeslot;
