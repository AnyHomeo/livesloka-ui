import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Chip } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
const PaymentsPage = () => {
  const [allData, setAllData] = useState();
  useEffect(() => {
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_KEY}/payment/get/alltransactions/`
    );
    setAllData(data);
  };

  const columnData = [
    {
      title: "Order Ref",
      field: "orderRef",
      render: (rowData) => {
        return (
          <>
            {rowData.status === "SUCCESS" ? (
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
    { title: "Paypal Customer Name", field: "paypalCustomerName" },
    { title: "Paypal Email", field: "paypalEmail" },
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

  const tableData = [];

  allData &&
    allData.data.result.map((data) => {
      let formData = {};
      if (data.paymentData !== null) {
        formData = {
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
        };
      } else {
        formData = {
          orderRef: data._id,
          paypalCustomerName: "NA",
          paypalEmail: "NA",
          studentName: data.customerId && data.customerId.firstName,
          guardianName: data.customerId && data.customerId.lastName,
          customerEmail: data.customerId && data.customerId.email,
          totalAmount: "NA",
          date: moment(data.createdAt).format("MMM Do YYYY h:mm A"),
          status: data.status,
        };
      }

      tableData.push(formData);
    });

  return (
    <div style={{ margin: 20 }}>
      <MaterialTable
        title="Payments"
        columns={columnData}
        data={tableData}
        options={{
          search: true,
          pageSizeOptions: [5, 20, 30, 40, 50, tableData.length],
        }}
      />
    </div>
  );
};

export default PaymentsPage;
