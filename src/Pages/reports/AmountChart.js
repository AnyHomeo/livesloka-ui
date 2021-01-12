import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import clsx from "clsx";

import {
  Box,
  Divider,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

const AmountChart = ({ dailyDataline, dataa, className, ...rest }) => {
  // console.log(dailyDataline);
  const classes = useStyles();

  const theme = useTheme();
  const [usdVal, setUsdVal] = useState();

  useEffect(() => {
    getUsdVal();
  }, []);

  const getUsdVal = async () => {
    const data = await axios.get(
      "https://free.currconv.com/api/v7/convert?q=USD_INR,INR_USD&compact=ultra&apiKey=eaff87f1207bb43ddfa6"
    );
    setUsdVal(data);
  };

  const mydate = new Date();
  let formatedDate = moment(mydate).format("MMMM");

  let newTestArray = [];
  let newTestDates = [];

  let morethan1day = [];

  let lessthan1day = [];

  let tatalallamounttest = [];
  if (dailyDataline) {
    Object.keys(dailyDataline).map((data) => {
      let testData = data;
      if (data.startsWith(formatedDate)) {
        dailyDataline[data].responses.map((data) => {
          if (testData === moment(data.createdAt).format("MMMM D YYYY")) {
            if (data.paymentData !== null) {
              morethan1day.push(
                parseInt(data.paymentData.transactions[0].amount.total)
              );
              console.log(morethan1day);
            }
          } else {
            if (data.paymentData !== null) {
              lessthan1day.push(
                parseInt(data.paymentData.transactions[0].amount.total)
              );
            }
          }
          // if (dailyDataDay === moment(data.createdAt).format("MMMM D YYYY")) {
          //   console.log(dailyDataDay);
          // }

          newTestDates.push(moment(data.createdAt).format("MMM Do YYYY"));
        });
      }
    });
  }

  let totaltestingsuum = morethan1day.reduce(function (a, b) {
    return a + b;
  }, 0);

  let newtotaldates = newTestDates.filter(function (item, index, inputArray) {
    return inputArray.indexOf(item) == index;
  });

  tatalallamounttest.push(totaltestingsuum);

  let alllllnewww = tatalallamounttest.concat(lessthan1day);

  const data = {
    datasets: [
      {
        data: alllllnewww,
        // backgroundColor: ["#27ae60", "#27ae60", "#27ae60"],
        borderWidth: 4,
        borderColor: "#27ae60",
        hoverBorderColor: "#27ae60",
      },
    ],
    labels: newtotaldates.reverse(),
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Amount per day" />
      <Divider />
      <CardContent>
        <Box height={300} position="relative">
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AmountChart;
