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

highchartsDrilldown(Highcharts);
highchartsExporting(Highcharts);
highchartsExport(Highcharts);

Highcharts.setOptions({
  lang: {
    drillUpText: "Back to Teachers",
  },
});

let totalAmount = 0;

const addArray = (arr) => {
  let numOr0 = (n) => (isNaN(n) ? 0 : n);
  if (arr.length) {
    console.log(arr.length);
    totalAmount += arr.reduce((a, b) => numOr0(a) + numOr0(b));
    return arr.reduce((a, b) => numOr0(a) + numOr0(b));
  }
  return 0;
};

let finaltotalStudent = [];
const totalStudents = (students) => {
  Object.keys(students.data.result).map((teacher) => {
    students.data.result[teacher].map((student) => {
      finaltotalStudent.push(student);
    });
  });
};

function FinancialAnalytics() {
  const [options, setOptions] = useState({});

  useEffect(() => {
    getFinancialStatistics()
      .then((data) => {
        totalStudents(data);
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
            width: "200px",
            marginRight: "10px",
            backgroundColor: "#2ecc71",
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "18px" }}>
            Total Amount:
          </h2>

          <h3 style={{ textAlign: "center", fontSize: "20px" }}>
            ₹ <CountUp start={0} end={totalAmount} separator="," /> /-
          </h3>
        </Card>

        <Card
          style={{
            width: "200px",
            marginLeft: "10px",
            backgroundColor: "#f1c40f",
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "18px" }}>
            Total Students:
          </h2>

          <h3 style={{ textAlign: "center", fontSize: "20px" }}>
            <CountUp start={0} end={finaltotalStudent.length} separator="," />
          </h3>
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
