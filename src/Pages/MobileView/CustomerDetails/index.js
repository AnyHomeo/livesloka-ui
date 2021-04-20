import React, { useState, useEffect } from "react";
import { getAllCustomerDetails } from "../../../Services/Services";
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCustomerDetails();
  }, []); 

  const fetchCustomerDetails = async () => {
    setLoading(true);
    const data = await getAllCustomerDetails();
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
    let regex = new RegExp(`^${value}`, `i`);
    const sortedArr =
      customersData && customersData.filter((x) => regex.test(x.firstName));

    setFilteredData(sortedArr);
  };

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
              <Grid item xs={4}>
                <Card
                  className="cus-data-name-card"
                  style={{
                    backgroundColor: "rgb(46, 204, 113)",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to={{
                      pathname: "/customer-data-info",
                      state: { data },
                    }}
                    style={{
                      color:"#fff"
                    }}
                  >
                    {data.firstName}
                  </Link>
                  <div className="cus-data-icons">
                    <a href={`https://wa.me/${data.whatsAppnumber}`}>
                      <IconButton>
                        <WhatsAppIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </a>
                    <a href={`tel:${data.phone}`} >

                    <IconButton>
                      <PhoneAndroidIcon style={{ color: "#fff" }} />
                    </IconButton>
                    </a>
                  </div>
                </Card>
              </Grid>
            ))
          : customersData &&
            customersData.map((data) => (
              <Grid item xs={4}>
                <Card
                  className="cus-data-name-card"
                  style={{
                    backgroundColor: "rgb(46, 204, 113)",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to={{
                      pathname: "/customer-data-info",
                      state: { data },
                    }}
                    style={{
                      color:"#fff"
                    }}
                  >
                    {data.firstName}
                  </Link>
                    {console.log(data)}
                  <div className="cus-data-icons">
                    <a href={`https://wa.me/${data.whatsAppnumber}`}>
                      <IconButton>
                        <WhatsAppIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </a>
                    <a href={`tel:${data.phone}`} >

                    <IconButton>
                      <PhoneAndroidIcon style={{ color: "#fff" }} />
                    </IconButton>
                    </a>
                  </div>
                </Card>
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export default CustomerDetails;
