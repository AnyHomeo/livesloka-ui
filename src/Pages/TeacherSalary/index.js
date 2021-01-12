import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { Button } from "@material-ui/core";
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(name, salary) {
  return {
    name,
    salary,
    details: [
      {
        ClassName: "Test",
        NoDays: "10",
        Commission: 100,
        TotalSalary: 5000,
      },
      {
        ClassName: "NOtest",
        NoDays: "10",
        Commission: 100,
        TotalSalary: 5000,
      },
      {
        ClassName: "Anytest",
        NoDays: "10",
        Commission: 100,
        TotalSalary: 5000,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <p style={{ fontWeight: "bold" }}>{row.TeacherName}</p>
        </TableCell>
        <TableCell>
          <p style={{ fontWeight: "bold" }}>{row.salary}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}>Class Name</p>
                    </TableCell>
                    <TableCell>
                      <p style={{ fontWeight: "bold" }}>No Of Days</p>
                    </TableCell>
                    <TableCell align="right">
                      <p style={{ fontWeight: "bold" }}>No Of Students</p>
                    </TableCell>
                    <TableCell align="right">
                      <p style={{ fontWeight: "bold" }}>Total Salary</p>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((historyRow) => (
                    <TableRow key={historyRow.ClassName}>
                      <TableCell component="th" scope="row">
                        {historyRow.ClassName}
                      </TableCell>
                      <TableCell>{historyRow["No.Students"]}</TableCell>

                      <TableCell align="right">
                        {historyRow.commission}
                      </TableCell>

                      <TableCell align="right">{historyRow.salary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData("Kamal", 1590),
  createData("Kamal2", 2620),
  createData("Kamal3", 2620),
  createData("Kamal4", 3050),
  createData("Kamal5", 3560),
];

const TeacherSalary = () => {
  const [salaryData, setSalaryData] = useState();
  const [getDate, setGetDate] = useState();

  const onNameChange = (event, values) => {
    setGetDate(values);
  };
  const getSalaries = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/teacher/get/salary/${getDate}`
    );
    console.log(data);
    setSalaryData(data && data.data.finalObj);
  };

  console.log(getDate);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginTop: "20px" }}>
        <Autocomplete
          id="combo-box-demo"
          options={top100Films}
          getOptionLabel={(option) => option.value}
          style={{ width: 300 }}
          onChange={onNameChange}
          renderInput={(params) => (
            <TextField {...params} label="Select Month" variant="outlined" />
          )}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={getSalaries}
      >
        Get Salaries
      </Button>

      <div style={{ width: "50%", marginTop: "40px" }}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <h3>Teacher Name</h3>
                </TableCell>
                <TableCell>
                  <h3>Total Salary</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(rows)}
              {salaryData &&
                salaryData.map((row) => (
                  <Row key={row.TeacherName} row={row} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TeacherSalary;

const top100Films = [{ title: "2021-01", value: "Jan 2021" }];
