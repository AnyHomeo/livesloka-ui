import React, { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  TablePagination,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const data = [
  {
    id: uuid(),
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  actions: {
    justifyContent: "flex-end",
  },
}));

const LatestOrders = ({ data, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Latest Transactions" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Ref</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.data.result.map((dataa) => {
                  if (dataa.paymentData !== null) {
                    return (
                      <TableRow hover key={dataa._id}>
                        <TableCell>{dataa.paymentData.id}</TableCell>
                        <TableCell>
                          {" "}
                          {dataa.customerId.firstName}{" "}
                          {dataa.customerId.lastName &&
                            dataa.customerId.lastName}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {dataa.paymentData.transactions[0].amount.total}{" "}
                          {dataa.paymentData.transactions[0].amount.currency}
                        </TableCell>

                        <TableCell>
                          {moment(dataa.createdAt).format("MMM Do YYYY h:mm A")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            style={{
                              backgroundColor: "#27ae60",
                              color: "white",
                            }}
                            label={dataa.status}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow hover key={dataa._id}>
                        <TableCell>{dataa._id}</TableCell>
                        <TableCell>
                          {" "}
                          {dataa.customerId.firstName}{" "}
                          {dataa.customerId.lastName &&
                            dataa.customerId.lastName}
                        </TableCell>
                        <TableCell>Not available</TableCell>

                        <TableCell>
                          {moment(dataa.createdAt).format("MMM Do YYYY h:mm A")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            style={{
                              backgroundColor: "#c0392b",
                              color: "white",
                            }}
                            label={dataa.status}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string,
};

export default LatestOrders;
