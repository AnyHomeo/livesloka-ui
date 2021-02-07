import React, { useState, useEffect } from "react";
import { getAllCustomerDetails } from "../../../Services/Services";
import { Paper, Grid, Card } from "@material-ui/core/";
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
  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    const data = await getAllCustomerDetails();
    setCustomersData(data && data.data);
    console.log(data);
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
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {customersData &&
          customersData.result.map((data) => (
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
