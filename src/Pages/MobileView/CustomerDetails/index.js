import React, { useState, useEffect } from "react";
import { getAllCustomerDetails, getData } from "../../../Services/Services";
import {
  Paper,
  Grid,
  Card,
  TextField,
  IconButton,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { PlusSquare, Monitor } from "react-feather";
import { useHistory } from "react-router-dom";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import "./style.css";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "10px",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const CustomerDetails = () => {
  const history = useHistory();
  const classes = useStyles();

  const [customersData, setCustomersData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [classStatusDrop, setClassStatusDrop] = useState();
  const [timeZoneId, setTimeZoneId] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCustomerDetails();
    fetchClassStatus();
  }, []);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    const data = await getAllCustomerDetails();

    console.log(data);
    // data && data.data.result.reverse();
    setCustomersData(data && data.data.result);
    setLoading(false);
  };

  useEffect(() => {
    filterData();
  }, [searchKeyword]);

  const filterData = () => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let value = capitalizeFirstLetter(searchKeyword);
    if (value.includes("Https")) {
      value = value.split("?")[0];
    }

    let regex = new RegExp(`^${value}`, `i`);
    const sortedArr =
      customersData &&
      customersData.filter(
        (x) =>
          regex.test(x.firstName) ||
          regex.test(x.meetingLink) ||
          regex.test(x.email) ||
          regex.test(x.lastName) ||
          regex.test(x.noOfClasses) ||
          regex.test(x.proposedAmount) ||
          regex.test(x.scheduleDescription) ||
          regex.test(x.whatsAppnumber) ||
          regex.test(x.gender)
      );

    setFilteredData(sortedArr);
  };

  const fetchClassStatus = async () => {
    const data = await getData("Class Status");
    const timeZone = await getData("Time Zone");

    setClassStatusDrop(data && data.data.result);
    setTimeZoneId(timeZone && timeZone.data.result);
  };

  const backgroundColorReturn = (id) => {
    let color = "";
    classStatusDrop &&
      classStatusDrop.map((data) => {
        if (data.id === id) {
          if (data.classStatusName === "New") {
            color = "#3498db";
          } else if (data.classStatusName === "In Class") {
            color = "#26de81";
          } else if (data.classStatusName === "Schedule Demo") {
            color = "#e67e22";
          } else {
            color = "#34495e";
          }
        }
      });

    return color;
  };

  const backgroundColorReturn2 = (id) => {
    let color = "";
    classStatusDrop &&
      classStatusDrop.map((data) => {
        if (data.id === id) {
          if (data.classStatusName === "New") {
            color = "#2980b9";
          } else if (data.classStatusName === "In Class") {
            color = "#20bf6b";
          } else if (data.classStatusName === "Schedule Demo") {
            color = "#d35400";
          } else {
            color = "#2c3e50";
          }
        }
      });

    return color;
  };

  function getTimeZone(id) {
    let timeZoneString = "";
    timeZoneId &&
      timeZoneId.map((data) => {
        if (data.id === id) {
          timeZoneString = data.timeZoneName;
        }
      });
    return <p style={{ color: "white", fontSize: 10 }}>{timeZoneString}</p>;
  }
  return (
    <div className={classes.root}>
      <div style={{ textAlign: "right" }}>
        <Link
          to={{
            pathname: "/add-customer-mobile",
          }}
        >
          <IconButton>
            <PlusSquare />
          </IconButton>
        </Link>
        <IconButton onClick={() => history.push("/customer-data")}>
          <Monitor />
        </IconButton>
      </div>
      <TextField
        fullWidth
        style={{ marginBottom: "20px" }}
        label="Search"
        variant="outlined"
        onChange={(e) => setSearchKeyword(e.target.value)}
        value={searchKeyword}
      />

      <Grid container spacing={2}>
        {loading
          ? ""
          : searchKeyword
          ? filteredData &&
            filteredData.map((data) => (
              <Link
                key={data._id}
                to={{
                  pathname: "/customer-data-info",
                  state: { data },
                }}
                style={{
                  width: "100%",
                  textDecoration: "none",
                }}
              >
                <Card
                  style={{
                    width: "100%",
                    height: 60,
                    marginBottom: 5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ecf0f1",
                    backgroundColor: backgroundColorReturn(data.classStatusId),
                    color: "white",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      marginLeft: 10,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      className={classes.heading}
                      style={{ fontSize: 14 }}
                    >
                      {data.firstName}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        className={classes.heading}
                        style={{ fontSize: 10 }}
                      >
                        {data.lastName}
                      </Typography>
                      <Typography
                        // className={classes.heading}
                        style={{
                          fontSize: 10,
                          marginRight: 10,
                          marginLeft: 10,
                        }}
                      >
                        {data.noOfClasses}
                      </Typography>
                      {getTimeZone(data.timeZoneId)}
                    </div>
                  </div>

                  <div
                    style={{
                      height: "100%",
                      width: "70px",
                      backgroundColor: backgroundColorReturn2(
                        data.classStatusId
                      ),
                      borderRadius: "0px 7px 5px 0px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <a href={`https://wa.me/${data.whatsAppnumber}`}>
                      <IconButton>
                        <WhatsAppIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </a>
                  </div>
                </Card>
              </Link>
            ))
          : customersData &&
            customersData.map((data) => {
              return (
                <>
                  <Link
                    key={data._id}
                    to={{
                      pathname: "/customer-data-info",
                      state: { data },
                    }}
                    style={{
                      width: "100%",
                      textDecoration: "none",
                    }}
                  >
                    <Card
                      style={{
                        width: "100%",
                        height: 60,
                        marginBottom: 5,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid #ecf0f1",
                        backgroundColor: backgroundColorReturn(
                          data.classStatusId
                        ),
                        color: "white",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          marginLeft: 10,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          className={classes.heading}
                          style={{ fontSize: 14 }}
                        >
                          {data.firstName}
                        </Typography>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            className={classes.heading}
                            style={{ fontSize: 10 }}
                          >
                            {data.lastName}
                          </Typography>
                          <Typography
                            // className={classes.heading}
                            style={{
                              fontSize: 10,
                              marginRight: 10,
                              marginLeft: 10,
                            }}
                          >
                            {data.noOfClasses}
                          </Typography>
                          {getTimeZone(data.timeZoneId)}
                        </div>
                      </div>

                      <div
                        style={{
                          height: "100%",
                          width: "70px",
                          backgroundColor: backgroundColorReturn2(
                            data.classStatusId
                          ),
                          borderRadius: "0px 7px 5px 0px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <a href={`https://wa.me/${data.whatsAppnumber}`}>
                          <IconButton>
                            <WhatsAppIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </a>
                      </div>
                    </Card>
                  </Link>
                </>
              );
            })}
      </Grid>
    </div>
  );
};

export default CustomerDetails;
