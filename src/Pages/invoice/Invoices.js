import React from "react";
import Adminsidebar from "../Admin/Adminsidebar";
import MaterialTable from "material-table";
import "../../sass/invoice-data.scss";
import { getInvoices, deleteInvoice } from "../../Services/Services";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import { DialogTitle } from "@material-ui/core";

class Invoices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      open: false,
      dialogData: [],
    };

    this.getAllInvoices();
  }

  async getAllInvoices() {
    let data = await getInvoices();
    data = data.data.result;

    let change = (prevState) => {
      prevState.data = data;
      return prevState;
    };

    this.setState(change);
  }

  print(data) {
    data = JSON.stringify(data);
    window.open("/invoice-generator?" + data);
  }

  async deleteInvoices(row) {
    let change = (prevState) => {
      prevState.data = prevState.data.filter((e) => e._id !== row._id);
      return prevState;
    };
    this.setState(change);

    let res = await deleteInvoice(row);
    console.log(res);
  }

  dialogHandle(row) {
    let change = (prevState) => {
      prevState.open = true;
      prevState.dialogData = row.classes;
      return prevState;
    };

    this.setState(change);
  }

  render() {
    return (
      <div className="main-div">
        <Adminsidebar />
        <Dialog open={this.state.open}>
          <DialogTitle>Classes</DialogTitle>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.dialogData.map((val, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{val.class}</TableCell>
                      <TableCell>{val.price}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>

        <MaterialTable
          options={{
            paging: false,
            actionsColumnIndex: 0,
            grouping: true,
          }}
          actions={[
            (rowData) => ({
              icon: "help",
              tooltip: "Classe",
              onClick: (event, rowData) => {
                this.dialogHandle(rowData);
              },
            }),
            (rowData) => ({
              icon: "print",
              tooltip: "Print",
              onClick: (event, rowData) => {
                this.print(rowData);
              },
            }),
            (rowData) => ({
              icon: "delete",
              tooltip: "delete",
              onClick: (event, rowData) => {
                this.deleteInvoices(rowData);
              },
            }),
          ]}
          style={{
            maxWidth: "80%",
          }}
          stickyHeader
          title="Invoices Data"
          columns={[
            {
              title: "Reference ID",
              field: "refID",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Invoice ID",
              field: "invoiceID",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Customer ID",
              field: "currentCustomerID",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Customer Name",
              field: "customerName",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Total Amount",
              field: "totalAmount",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Invoice Date",
              field: "invoiceDate",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
            {
              title: "Due Date",
              field: "dueDate",
              width: "1%",
              cellStyle: { whiteSpace: "nowrap" },
              headerStyle: { whiteSpace: "nowrap" },
            },
          ]}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default Invoices;
