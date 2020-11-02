import { Button, Chip, MenuItem, Select, TextField } from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";
import md5 from "md5";
import React from "react";
import "../../sass/invoice.scss";

import { getAllCustomerDetails } from "../../Services/Services";
import Adminsidebar from "../Admin/Adminsidebar";

class Invoice extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      refID: "",
      invoiceID: "",
      currentCustomerID: "",
      customerName: "",
      customers: [],
      classes: [{ class: "", price: 0 }],
      totalAmount: 0,
      invoiceDate: "",
      dueDate: "",
      note: "",
    };

    this.getCustomers();
    this.initialiseIdentity();
  }

  initialiseIdentity() {
    let user = JSON.parse(document.cookie.split("=")[1]);

    let ref = md5(user.userId);

    let invoiceID = md5(user.userId + new Date().toString());

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.refID = ref;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.invoiceID = invoiceID;
  }

  async getCustomers() {
    let { data } = await getAllCustomerDetails();

    let change = (prevState) => {
      prevState.customers = data.result;
      return prevState;
    };

    this.setState(change);
  }

  addClass() {
    let change = (prevState) => {
      prevState.classes.push({ class: "", price: 0 });
      let total = 0;

      prevState.classes.forEach((val) => {
        total = parseInt(val.price) + total;
      });
      prevState.totalAmount = this.getTotal();

      return prevState;
    };

    this.setState(change);
  }
  submit() {
    let data = Object.assign({}, this.state);
    data = { ...this.state };
    delete data["customers"];
    data = JSON.stringify(data);

    window.open("/invoice-generator?" + data);
  }

  remove(index, val) {
    let change = (prevState) => {
      prevState.classes.splice(index, 1);
      let total = 0;

      prevState.classes.forEach((val) => {
        total = parseInt(val.price) + total;
      });
      prevState.totalAmount = this.getTotal();
      return prevState;
    };

    this.setState(change);
  }

  getTotal() {
    let total = 0;

    this.state.classes.forEach((val) => {
      total = parseInt(val.price) + total;
    });

    return total;
  }

  render() {
    return (
      <div className="main-div">
        <Adminsidebar />
        <div className="invoice">
          <div className="section invoice-data">
            <h3>Invoice Details</h3>
            <Chip className="field" label={"Ref :" + this.state.refID} />
            <br></br>
            <Chip
              className="field"
              label={"Invoice ID :" + this.state.invoiceID}
            />
            <br></br>
            <TextField
              label="Invoice Date"
              type="date"
              defaultValue={new Date().toLocaleDateString()}
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoiceDate = e.target.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              defaultValue={new Date().toLocaleDateString()}
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.dueDate = e.target.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="section customer-data">
            <h3>Customer Details</h3>
            <Select
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.currentCustomerID = e.target.value._id;

                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.customerName = e.target.value.firstName;
              }}
            >
              {this.state.customers.map((val, index) => {
                return (
                  <MenuItem key={index} value={val}>
                    {val.firstName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className="section classes">
            <h3>Add Classes</h3>
            {this.state.classes.map((val, index) => {
              return (
                <div key={index}>
                  <TextField
                    className="field"
                    type="text"
                    label="Class Name"
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.classes[index]["class"] = e.target.value;
                    }}
                  />
                  <TextField
                    className="field"
                    type="number"
                    label="Price"
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.classes[index]["price"] = e.target.value;

                      let change = (prevState) => {
                        prevState.totalAmount = this.getTotal();

                        return prevState;
                      };

                      this.setState(change);
                    }}
                  />
                  <Button
                    className="field"
                    onClick={this.remove.bind(this, index)}
                  >
                    <RemoveCircle />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="section actions">
            <TextField
              className="field"
              multiline
              label="Note"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.note = e.target.value;
              }}
            />
            <br></br>
            <Button
              className="field"
              variant="contained"
              color="primary"
              onClick={this.addClass.bind(this)}
            >
              Add
            </Button>
            <Button
              className="field"
              variant="contained"
              color="primary"
              onClick={this.submit.bind(this)}
            >
              Submit
            </Button>
            <Chip label={this.state.totalAmount} className="field" />
          </div>
        </div>
      </div>
    );
  }
}

export default Invoice;
