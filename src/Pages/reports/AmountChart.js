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

const AmountChart = ({ dataa, className, ...rest }) => {
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

  //   {moment(data.createdAt).format("MMM Do YYYY")}

  let AmountArray = [];
  let Dates = [];
  if (dataa) {
    dataa.data.result.map((data) => {
      if (data.paymentData !== null) {
        AmountArray.push(
          parseInt(data.paymentData.transactions[0].amount.total) *
            (usdVal && usdVal.data.USD_INR)
        );

        Dates.push(moment(data.createdAt).format("MMM Do YYYY"));
      }
    });
  }

  console.log(Dates);

  const data = {
    datasets: [
      {
        data: AmountArray,
        // backgroundColor: ["#27ae60", "#27ae60", "#27ae60"],
        borderWidth: 4,
        borderColor: "#27ae60",
        hoverBorderColor: "#27ae60",
      },
    ],
    labels: Dates,
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
