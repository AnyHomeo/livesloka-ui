import React, { useEffect, useState } from "react";
import { getFinancialStatistics } from "../../Services/Services";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsDrilldown from "highcharts/modules/drilldown";
import { Card, Grid } from "@material-ui/core";
import highchartsExporting from "highcharts/modules/exporting";
import highchartsExport from "highcharts/modules/export-data";
import "./style.css";
import CountUp from "react-countup";
import useDocumentTitle from "../../Components/useDocumentTitle";

highchartsDrilldown(Highcharts);
highchartsExporting(Highcharts);
highchartsExport(Highcharts);

Highcharts.setOptions({
  lang: {
    drillUpText: "Back to Teachers",
  },
});

function FinancialAnalytics() {
  useDocumentTitle("Financial Analytics - LiveSloka");

  const [options, setOptions] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  let numOr0 = (n) => (isNaN(n) ? 0 : n);
  const addArray = (arr) => {
    if (arr.length) {
      return arr.reduce((a, b) => numOr0(a) + numOr0(b));
    }
    return 0;
  };

  useEffect(() => {
    getFinancialStatistics()
      .then((data) => {
        setOptions({
          chart: {
            type: "column",
          },
          title: {
            text: "Teacher wise Financial Statistics",
          },
          subtitle: {
            text: "Click the columns to view Students According to Teachers",
          },

          accessibility: {
            announceNewData: {
              enabled: true,
            },
          },
          xAxis: {
            type: "category",
            title: "Name",
          },
          yAxis: {
            title: {
              text: "Total Amount (in ₹)",
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: "₹{point.y}/-",
              },
            },
          },

          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">Amount</span>: <b>₹{point.y}/-</b><br/>',
          },
          credits: {
            enabled: false,
          },

          exporting: {
            csv: {
              columnHeaderFormatter: function (item, key) {
                if (!item || item instanceof Highcharts.Axis) {
                  return "Name";
                } else {
                  return item.name;
                }
              },
            },
            enabled: true,
            scale: 4,
            chartOptions: {
              plotOptions: {
                series: {
                  dataLabels: {
                    enabled: true,
                    style: {
                      fontSize: "6px",
                    },
                  },
                },
              },
            },
          },

          series: [
            {
              name: "Amount",
              colorByPoint: true,
              data: Object.keys(data.data.result).map((teacher) => ({
                name: teacher,
                y: addArray(
                  data.data.result[teacher].map((student) => student.amount)
                ),
                drilldown: teacher,
              })),
            },
          ],

          drilldown: {
            series: Object.keys(data.data.result).map((teacher) => ({
              name: teacher,
              id: teacher,
              data: data.data.result[teacher].map((student) => ({
                name: student.studentName,
                y: student.amount,
              })),
            })),
          },
        });
        let totalSum = 0;
        let totalStudentsSum = 0;
        const { result } = data.data;
        Object.keys(result).forEach((teacher) => {
          totalStudentsSum += result[teacher].length;
          totalSum += result[teacher].length
            ? addArray(result[teacher].map((student) => student.amount))
            : 0;
        });
        setTotalAmount(totalSum);
        setTotalStudents(totalStudentsSum);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <Card
          style={{
            margin: "10px",
            padding: "30px 50px",
            backgroundColor: "#2ecc71",
          }}
        >
          <h5 style={{ textAlign: "center" }}>Total Amount:</h5>

          <h1 style={{ textAlign: "center" }}>
            ₹ <CountUp start={0} end={totalAmount} separator="," /> /-
          </h1>
        </Card>

        <Card
          style={{
            margin: "10px",
            padding: "30px 50px",
            backgroundColor: "#f1c40f",
          }}
        >
          <h5 style={{ textAlign: "center" }}>Total Students:</h5>

          <h1 style={{ textAlign: "center" }}>
            <CountUp start={0} end={totalStudents} separator="," />
          </h1>
        </Card>
      </div>

      <Grid container style={{ marginTop: "40px" }}>
        <Grid item xs={false} sm={false} md={1} lg={2} />
        {Object.keys(options).length ? (
          <Grid item xs={12} sm={12} md={10} lg={8}>
            <Card style={{ borderRadius: "20px", marginBottom: "100px" }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { height: "400px" } }}
              />
            </Card>
          </Grid>
        ) : (
          <span />
        )}
        <Grid item xs={false} sm={false} md={1} lg={2} />
      </Grid>
    </>
  );
}

export default FinancialAnalytics;
