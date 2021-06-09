import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Chip } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import paypal from "../../Images/paypal.png";
import razorpay from "../../Images/Razorpay_logo.svg";
import useWindowDimensions from "../../Components/useWindowDimensions";
import useDocumentTitle from "../../Components/useDocumentTitle";

const PaymentsPage = () => {
  useDocumentTitle("Payments Info - LiveSloka");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { height } = useWindowDimensions();
  useEffect(() => {
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    setLoading(true);
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/payment/get/alltransactions/`
    );
    let fullTableData = data.data.result.map((data) => {
      if (data.type === "RAZORPAY") {
        return {
          orderRef: data.paymentData.payload.payment.entity.id,
          paypalCustomerName: "NA",
          paypalEmail: data.paymentData.payload.payment.entity.email,
          studentName:
            data.customerId === null ? "NA" : data.customerId.firstName,
          guardianName:
            data.customerId === null ? "NA" : data.customerId.lastName,
          customerEmail:
            data.customerId === null ? "NA" : data.customerId.email,
          totalAmount: `${
            data.paymentData.payload.payment.entity.amount / 100
          } ${data.paymentData.payload.payment.entity.currency}`,
          date: moment(data.createdAt).format("MMM Do YYYY h:mm A"),
          status: data.status,
          type: data.type,
        };
      } else if (data.paymentData !== null && data.type === "PAYPAL") {
        return {
          orderRef:
            data.paymentData.transactions[0].related_resources[0].sale.id,
          paypalCustomerName: `${data.paymentData.payer.payer_info.first_name} ${data.paymentData.payer.payer_info.last_name}`,
          paypalEmail: data.paymentData.payer.payer_info.email,
          studentName:
            data.customerId === null ? "NA" : data.customerId.firstName,
          guardianName:
            data.customerId === null ? "NA" : data.customerId.lastName,
          customerEmail:
            data.customerId === null ? "NA" : data.customerId.email,
          totalAmount: `${data.paymentData.transactions[0].amount.total} ${data.paymentData.transactions[0].amount.currency}`,
          date: moment(data.createdAt).format("MMM Do YYYY h:mm A"),
          status: data.status,
          type: data.type,
        };
      } else {
        return {
          orderRef: data._id,
          paypalCustomerName: "NA",
          paypalEmail: "NA",
          studentName: data.customerId && data.customerId.firstName,
          guardianName: data.customerId && data.customerId.lastName,
          customerEmail: data.customerId && data.customerId.email,
          totalAmount: "NA",
          date: moment(data.createdAt).format("MMM Do YYYY h:mm A"),
          status: data.status,
          type: data.type,
        };
      }
    });
    setAllData(fullTableData);
    setLoading(false);
  };

  const columnData = [
    {
      title: "Order Ref",
      field: "orderRef",
      render: (rowData) => {
        return (
          <>
            {rowData.status === "SUCCESS" && rowData.type === "PAYPAL" ? (
              <a
                target="_blank"
                href={`https://www.paypal.com/activity/payment/${rowData.orderRef}`}
              >
                {rowData.orderRef}
              </a>
            ) : (
              rowData.orderRef
            )}
          </>
        );
      },
    },
    { title: "Payment Customer Name", field: "paypalCustomerName" },
    { title: "Payment Email", field: "paypalEmail" },
    {
      title: "Student Name",
      field: "studentName",
    },
    {
      title: "Guardian Name",
      field: "guardianName",
    },
    {
      title: "Customer Email",
      field: "customerEmail",
    },
    {
      title: "Total Amount",
      field: "totalAmount",
    },
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Payment Type",
      field: "type",
      render: (row) =>
        row.type === "PAYPAL" ? (
          <img src={paypal} style={{ height: "20px" }} />
        ) : (
          <img src={razorpay} style={{ height: "20px" }} />
        ),
    },
    {
      title: "Status",
      field: "status",
      render: ({ status }) => {
        return (
          <Chip
            style={{
              backgroundColor: status === "SUCCESS" ? "#27ae60" : "#e74c3c",
              color: "white",
            }}
            label={status}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <MaterialTable
      title="Payments"
      columns={columnData}
      data={allData}
      isLoading={loading}
      style={{
        margin: "20px",
        padding: "20px",
      }}
      options={{
        search: true,
        pageSizeOptions: [5, 20, 30, 40, 50, allData.length],
        maxBodyHeight: height - 270,
        exportButton: true,
        paginationType: "stepped",
        searchFieldVariant: "outlined",
      }}
    />
  );
};

export default PaymentsPage;
