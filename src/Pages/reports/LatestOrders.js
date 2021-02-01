import React, { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
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
} from "@material-ui/core";

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

  const sortedData = [];

  data &&
    data.data.result.map((data) => {
      const formatedDate = moment(data.createdAt).format("MMM");

      if (formatedDate === moment(new Date()).format("MMM")) {
        sortedData.push(data);
      }
    });

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
              {sortedData &&
                sortedData.map((dataa) => {
                  if (dataa.paymentData !== null) {
                    return (
                      <TableRow hover key={dataa._id}>
                        <TableCell>{dataa.paymentData.id}</TableCell>
                        <TableCell>
                          {" "}
                          {dataa.paymentData.payer.payer_info.first_name}{" "}
                          {dataa.paymentData.payer.payer_info.last_name}
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
