import React, { useState, useEffect } from "react";
import { getAllCustomerDetails, getData } from "../../../Services/Services";
import { Paper, Grid, Card, TextField, IconButton } from "@material-ui/core/";
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

    data && data.data.result.reverse();
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
          regex.test(x.whatsAppnumber)
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
    classStatusDrop.map((data) => {
      if (data.id === id) {
        if (data.classStatusName === "New") {
          color = "#3f51b5";
        } else if (data.classStatusName === "In Class") {
          color = "#27ae60";
        } else if (data.classStatusName === "Schedule Demo") {
          color = "#f1c40f";
        } else {
          color = "#7f8c8d";
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
    return <p style={{ marginTop: 5, color: "white" }}>{timeZoneString}</p>;
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
              <Grid item xs={4} key={data._id}>
                <Card
                  className="cus-data-name-card"
                  style={{
                    backgroundColor: backgroundColorReturn(data.classStatusId),
                    textAlign: "center",
                  }}
                >
                  <Link
                    to={{
                      pathname: "/customer-data-info",
                      state: { data },
                    }}
                    style={{
                      color: "#fff",
                    }}
                  >
                    {data.firstName}
                  </Link>
                  <p style={{ color: "white" }}>{data.noOfClasses}</p>

                  <div className="cus-data-icons">
                    <a href={`https://wa.me/${data.whatsAppnumber}`}>
                      <IconButton>
                        <WhatsAppIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </a>
                    <a href={`tel:${data.phone}`}>
                      <IconButton>
                        <PhoneAndroidIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </a>
                  </div>
                </Card>
              </Grid>
            ))
          : customersData &&
            customersData.map((data) => {
              return (
                <>
                  <Grid item xs={4} key={data._id}>
                    <Card
                      className="cus-data-name-card"
                      style={{
                        backgroundColor: backgroundColorReturn(
                          data.classStatusId
                        ),
                        textAlign: "center",
                      }}
                    >
                      <Link
                        to={{
                          pathname: "/customer-data-info",
                          state: { data },
                        }}
                        style={{
                          color: "#fff",
                        }}
                      >
                        {data.firstName}
                      </Link>
                      <p style={{ color: "white" }}>{data.noOfClasses}</p>
                      {getTimeZone(data.timeZoneId)}
                      <div className="cus-data-icons">
                        <a href={`https://wa.me/${data.whatsAppnumber}`}>
                          <IconButton>
                            <WhatsAppIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </a>
                        <a href={`tel:${data.phone}`}>
                          <IconButton>
                            <PhoneAndroidIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </a>
                      </div>
                    </Card>
                  </Grid>
                </>
              );
            })}
      </Grid>
    </div>
  );
};

export default CustomerDetails;
