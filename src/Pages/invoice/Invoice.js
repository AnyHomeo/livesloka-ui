import {
  Button,
  Chip,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";
import md5 from "md5";
import React from "react";
import "../../sass/invoice.scss";
import coinify from "coinify";

import {
  getAllCustomerDetails,
  addInvoice,
  getData,
} from "../../Services/Services";


class Invoice extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      customers: [],
      currencies: [],
      classData: [],
      invoice: {
        classes: [{ class: "", price: 0 }],
        refID: "",
        invoiceID: "",
        currentCustomerID: "",
        customerName: "",
        currency: "",
        totalAmount: 0,
        totalAmountINR: 0,
        invoiceDate: "",
        dueDate: "",
        note: "",
      },
    };

    this.getCustomers();
    this.initialiseIdentity();
  }

  initialiseIdentity() {
    let user = JSON.parse(document.cookie.split("=")[1]);

    let ref = md5(user.userId);

    let invoiceID =
      (Math.random() * 1000000000).toFixed(0) + Date.now().toString(10);

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.invoice.refID = ref;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.invoice.invoiceID = invoiceID;
  }

  async getCustomers() {
    let customers = await getAllCustomerDetails();

    let currencies = await getData("Currency");
    let classData = await getData("Class");

    let change = (prevState) => {
      prevState.customers = customers.data.result;
      prevState.classData = classData.data.result;

      let curren = currencies.data.result.filter(
        (val) => val.currencyStatus === "1"
      );
      prevState.currencies = curren;

      return prevState;
    };

    this.setState(change);
  }

  addClass() {
    let change = (prevState) => {
      prevState.invoice.classes.push({ class: "", price: 0 });
      let total = 0;

      prevState.invoice.classes.forEach((val) => {
        total = parseInt(val.price) + total;
      });
      prevState.invoice.totalAmount = this.getTotal();

      return prevState;
    };

    this.setState(change);
  }
  submit() {
    addInvoice(this.state.invoice)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    this.props.history.push({
      pathname: "/invoice-generator",
      state: this.state.invoice,
    });

    // data = JSON.stringify(data);
    // window.open("/invoice-generator?" + data);
  }

  remove(index, val) {
    let change = (prevState) => {
      prevState.invoice.classes.splice(index, 1);
      let total = 0;

      prevState.invoice.classes.forEach((val) => {
        total = parseInt(val.price) + total;
      });
      prevState.invoice.totalAmount = this.getTotal();
      return prevState;
    };

    this.setState(change);
  }

  getTotal() {
    let total = 0;

    this.state.invoice.classes.forEach((val) => {
      total = parseInt(val.price) + total;
    });

    return total;
  }

  render() {
    return (
      <div className="main-div">
        <div className="invoice">
          <div className="section invoice-data">
            <h3>Invoice Details</h3>
            <Chip
              className="field"
              label={"Ref : " + this.state.invoice.refID}
            />
            <br></br>
            <TextField
              label="Invoice ID"
              defaultValue={this.state.invoice.invoiceID}
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoice.invoiceID = e.target.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br></br>
            <TextField
              label="Invoice Date"
              type="date"
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoice.invoiceDate = e.target.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              className="field"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoice.dueDate = e.target.value;
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="section customer-data">
            <h3>Customer Details</h3>
            <FormControl className="field" style={{ minWidth: 160 }}>
              <InputLabel id="cus-name">Customer Name</InputLabel>
              <Select
                labelId="cus-name"
                onChange={(e) => {
                  // eslint-disable-next-line react/no-direct-mutation-state
                  this.state.invoice.currentCustomerID = e.target.value._id;

                  // eslint-disable-next-line react/no-direct-mutation-state
                  this.state.invoice.customerName = e.target.value.firstName;
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
            </FormControl>
            <FormControl className="field" style={{ minWidth: 160 }}>
              <InputLabel id="cur-name">Currency</InputLabel>
              <Select
                labelId="cur-name"
                onChange={(e) => {
                  let change = (prevState) => {
                    prevState.invoice.currency = e.target.value;
                    return prevState;
                  };

                  this.setState(change);
                }}
              >
                {this.state.currencies.map((val, index) => {
                  return (
                    <MenuItem key={index} value={val.currencyName}>
                      {val.currencyName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="section classes">
            <h3>Add Classes</h3>
            {this.state.invoice.classes.map((val, index) => {
              return (
                <div key={index}>
                  {/* <TextField
                    className="field"
                    type="text"
                    label="Class Name"
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.invoice.classes[index]["class"] =
                        e.target.value;
                    }}
                  /> */}
                  <FormControl className="field" style={{ minWidth: 160 }}>
                    <InputLabel id="class-name">Class Name</InputLabel>
                    <Select
                      labelId="class-name"
                      onChange={(e) => {
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.invoice.classes[index]["class"] =
                          e.target.value;
                      }}
                    >
                      {this.state.classData.map((val, index) => {
                        return (
                          <MenuItem key={index} value={val.className}>
                            {val.className}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    className="field"
                    type="number"
                    label={"Price in " + this.state.invoice.currency}
                    onChange={(e) => {
                      // eslint-disable-next-line react/no-direct-mutation-state
                      this.state.invoice.classes[index]["price"] =
                        e.target.value;

                      let change = (prevState) => {
                        prevState.invoice.totalAmount = this.getTotal();

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
              type="number"
              step="any"
              label="Total in INR"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoice.totalAmountINR = e.target.value;
              }}
            />
            <TextField
              className="field"
              multiline
              label="Note"
              onChange={(e) => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.invoice.note = e.target.value;
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
            <Chip
              label={
                this.state.invoice.totalAmount.toString() +
                " " +
                coinify.symbol(this.state.invoice.currency) +
                " /-"
              }
              className="field"
            />
            <a
              className="field"
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://www.xe.com/currencyconverter/convert/?Amount=" +
                this.state.invoice.totalAmount.toString() +
                "&From=" +
                this.state.invoice.currency +
                "&To=INR"
              }
            >
              Click Here for Conversion
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Invoice;
