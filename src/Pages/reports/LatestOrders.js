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
import { Link } from "react-router-dom";

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

  // const sortedData = [];

  // data &&
  //   data.data.result.map((data) => {
  //     const formatedDate = moment(data.createdAt).format("MMM");

  //     if (formatedDate === moment(new Date()).format("MMM")) {
  //       sortedData.push(data);
  //     }
  //   });

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
                <TableCell>Paypal Customer Name</TableCell>
                <TableCell>Paypal Email</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Guardian Name</TableCell>
                <TableCell>Customer Email</TableCell>
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
                        <TableCell>
                          <a
                            target="_blank"
                            style={{ color: "blue" }}
                            href={`https://www.paypal.com/activity/payment/${dataa.paymentData.transactions[0].related_resources[0].sale.id}`}
                          >
                            {
                              dataa.paymentData.transactions[0]
                                .related_resources[0].sale.id
                            }
                          </a>
                        </TableCell>
                        <TableCell>
                          {" "}
                          {dataa.paymentData.payer.payer_info.first_name}{" "}
                          {dataa.paymentData.payer.payer_info.last_name}
                        </TableCell>

                        <TableCell>
                          {" "}
                          {dataa.paymentData.payer.payer_info.email}
                        </TableCell>

                        <TableCell>
                          {" "}
                          {dataa.customerId && dataa.customerId.firstName}{" "}
                        </TableCell>

                        <TableCell>
                          {" "}
                          {dataa.customerId && dataa.customerId.lastName}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {dataa.customerId && dataa.customerId.email}
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

                        <TableCell>NA</TableCell>
                        <TableCell>NA</TableCell>

                        <TableCell>
                          {" "}
                          {dataa.customerId && dataa.customerId.firstName}{" "}
                        </TableCell>
                        <TableCell>
                          {dataa.customerId && dataa.customerId.lastName}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {dataa.customerId && dataa.customerId.email}
                        </TableCell>
                        <TableCell>NA</TableCell>
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
