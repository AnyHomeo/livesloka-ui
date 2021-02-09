import React, { useState, useEffect } from "react";
import { getAllCustomerDetails } from "../../../Services/Services";
import { Paper, Grid, Card, TextField } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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
      <Link
        to={{
          pathname: "/add-customer-mobile",
        }}
      >
        <Card
          style={{
            width: "100%",
            height: 70,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginTop: "8px",
            marginBottom: "15px",
            backgroundColor: "#1abc9c",
            color: "white",
          }}
        >
          Add new
        </Card>
      </Link>
      <TextField
        fullWidth
        style={{ marginBottom: "20px" }}
        label="Search"
        variant="outlined"
        onChange={(e) => setSearchKeyword(e.target.value)}
        value={searchKeyword}
      />

      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {loading
          ? ""
          : searchKeyword
          ? filteredData &&
            filteredData.map((data) => (
              <Grid item xs={4}>
                <Link
                  to={{
                    pathname: "/customer-data-info",
                    state: { data },
                  }}
                >
                  <Card
                    style={{
                      width: 110,
                      height: 70,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "#2ecc71",
                      color: "white",
                    }}
                  >
                    {data.firstName}
                  </Card>
                </Link>
              </Grid>
            ))
          : customersData &&
            customersData.map((data) => (
              <Grid item xs={4}>
                <Link
                  to={{
                    pathname: "/customer-data-info",
                    state: { data },
                  }}
                >
                  <Card
                    style={{
                      width: 110,
                      height: 70,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "#2ecc71",
                      color: "white",
                    }}
                  >
                    {data.firstName}
                  </Card>
                </Link>
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export default CustomerDetails;
