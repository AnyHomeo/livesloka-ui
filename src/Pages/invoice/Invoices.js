import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
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
import { Button, Chip, DialogTitle, TextField } from "@material-ui/core";

class Invoices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      open: false,
      dialogData: [],
      startDate: "",
      endDate: "",
    };

    this.getAllInvoices();
  }

  async getAllInvoices() {
    let data = await getInvoices({
      start: this.state.startDate,
      end: this.state.endDate,
    });
    data = data.data.result;

    let change = (prevState) => {
      prevState.data = data;
      return prevState;
    };

    this.setState(change);
  }

  print(data) {
    this.props.history.push({
      pathname: "/invoice-generator",
      state: this.state.data,
    });
  }

  async deleteInvoices(row) {
    let change = (prevState) => {
      prevState.data = prevState.data.filter((e) => e._id !== row._id);
      return prevState;
    };
    this.setState(change);

    let res = await deleteInvoice(row);
  }

  dialogHandle(row) {
    let change = (prevState) => {
      prevState.open = !prevState.open;
      prevState.dialogData = row.classes;
      return prevState;
    };

    this.setState(change);
  }

  render() {
    return (
      <div className="main-div">
        <Dialog open={this.state.open}>
          <DialogTitle>
            <Chip
              label="X"
              onClick={(e) => {
                let change = (prevState) => {
                  prevState.open = false;
                  return prevState;
                };

                this.setState(change);
              }}
            />
            {"   "}
            Classes
          </DialogTitle>
          <div className="dialog-div">
            <TableContainer className="container" component={Paper}>
              <Table style={{ padding: "20px" }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ padding: "10px" }}>Class</TableCell>
                    <TableCell style={{ padding: "10px" }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.dialogData.map((val, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ padding: "10px" }}>
                          {val.class}
                        </TableCell>
                        <TableCell style={{ padding: "10px" }}>
                          {val.price}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Dialog>

        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                <MTableToolbar {...props} />
                <div style={{ padding: "0px 10px" }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    style={{ margin: 10 }}
                    className="field"
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.startDate = e.target.value;
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    style={{ margin: 10 }}
                    label="End Date"
                    type="date"
                    className="field"
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.endDate = e.target.value;
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Button
                    style={{ margin: 10 }}
                    className="field"
                    variant="contained"
                    color="primary"
                    onClick={this.getAllInvoices.bind(this)}
                  >
                    Filter
                  </Button>
                </div>
              </div>
            ),
          }}
          options={{
            paging: false,
            actionsColumnIndex: 0,
            grouping: true,
          }}
          actions={[
            (rowData) => ({
              icon: "I",
              tooltip: "Classes",
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
              title: "Invoice ID",
              field: "invoiceID",
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
              title: "Currency",
              field: "currency",
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
              title: "Total Amount (INR)",
              field: "totalAmountINR",
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
            {
              title: "Reference ID",
              field: "refID",
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
