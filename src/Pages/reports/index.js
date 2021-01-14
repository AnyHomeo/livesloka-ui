import React, { useState, useEffect } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "../Page";
import Budget from "./Budget";
import LatestOrders from "./LatestOrders";
import TasksProgress from "./TasksProgress";
import TotalCustomers from "./TotalCustomers";
import TotalProfit from "./TotalProfit";
import TrafficByDevice from "./TrafficByDevice";
import moment from "moment";
import axios from "axios";
import AmountChart from "./AmountChart";
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

  const [dailyDataLine, setDailyDataLine] = useState();

  const getAllTransactions = async () => {
    let amount = 0;
    let failedtransactions = 0;
    let successtransactions = 0;
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/payment/get/alltransactions/`
    );

    setAllData(data);
    // if (data) {
    //   data.data.result.map((data) => {
    //     if (data.paymentData !== null) {
    //       successtransactions++;
    //       setSuccessTrx(successtransactions);
    //       amount += parseInt(data.paymentData.transactions[0].amount.total);
    //       setTotalAmount(amount);
    //     } else {
    //       failedtransactions++;
    //       setFailedTrx(failedtransactions);
    //     }
    //   });
    // }

    // Daily data and Monthly Data

    let dailyData = {};
    let monthlyData = {};

    data &&
      data.data.result.forEach((val) => {
        let count = 0;
        if (val.paymentData !== null) {
          const date = moment(val.paymentData.create_time).format(
            "MMMM D YYYY"
          );
          dailyData[date] = dailyData[date] || {
            count: 0,
            responses: [],
          };
          dailyData[date][val.type] = dailyData[date][val.type] || 0;
          dailyData[date][val.type]++;
          dailyData[date].responses.push(val);
        }
      });
    setDailyDataLine(dailyData);

    data &&
      data.data.result.forEach((item) => {
        let month = moment(item.createdAt).format("MMMM YYYY");
        monthlyData[month] = monthlyData[month] || { count: 0, responses: [] };
        monthlyData[month].count++;
        monthlyData[month].responses.push(item);
      });

    monthlyData["January 2021"].responses.map((data) => {
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

    setTotalTransactions(monthlyData["January 2021"].responses.length);
  };

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget dataa={allData} amount={totalAmount} />
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
          <Grid item lg={8} md={6} xl={3} xs={12}>
            <AmountChart dailyDataline={dailyDataLine} dataa={allData} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice
              totaltrx={totalTransactions}
              failed={failedTrx}
              success={successTrx}
            />
          </Grid>
          {/* <Grid item lg={12} sm={12} xl={3} xs={12}>
            <TimelineTrx data={allData} />
          </Grid> */}
          <Grid item lg={12} md={12} xl={9} xs={12}>
            <LatestOrders data={allData} />
          </Grid>
          {/* <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice
              totaltrx={totalTransactions}
              failed={failedTrx}
              success={successTrx}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
