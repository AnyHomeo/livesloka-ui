import React, { useState, useEffect } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "../Page";
import Budget from "./Budget";
import LatestOrders from "./LatestOrders";
import LatestProducts from "./LatestProducts";
import Sales from "./Sales";
import TasksProgress from "./TasksProgress";
import TotalCustomers from "./TotalCustomers";
import TotalProfit from "./TotalProfit";
import TrafficByDevice from "./TrafficByDevice";
import axios from "axios";
import TimelineTrx from "./TimelineTrx";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  useEffect(() => {
    getAllTransactions();
  }, []);

  const [allData, setAllData] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalTransactions, setTotalTransactions] = useState();
  const [successTrx, setSuccessTrx] = useState();
  const [failedTrx, setFailedTrx] = useState();
  const getAllTransactions = async () => {
    let amount = 0;
    let failedtransactions = 0;
    let successtransactions = 0;
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/payment/get/alltransactions/`
    );
    console.log(data);
    setTotalTransactions(data && data.data.result.length);

    setAllData(data);
    if (data) {
      data.data.result.map((data) => {
        if (data.paymentData !== null) {
          successtransactions++;
          setSuccessTrx(successtransactions);
          amount += parseInt(data.paymentData.transactions[0].amount.total);
          setTotalAmount(amount);
        } else {
          failedtransactions++;
          setFailedTrx(failedtransactions);
        }
      });
    }
  };

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget amount={totalAmount} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers total={totalTransactions} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress success={successTrx} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit failed={failedTrx} />
          </Grid>
          {/* <Grid item lg={12} sm={12} xl={3} xs={12}>
            <TimelineTrx data={allData} />
          </Grid> */}
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders data={allData} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
