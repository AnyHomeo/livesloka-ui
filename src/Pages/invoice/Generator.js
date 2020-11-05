import { Divider } from "@material-ui/core";
import React from "react";
import Logo from "../../Images/Logo2.png";
import "../../sass/generator.scss";
import coinify from "coinify";

class InvoiceGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getOb();

    console.log(this.state);

    if (this.state == null) {
      this.props.history.push({
        pathname: "/manual-invoice",
      });
    }
  }

  componentDidMount() {
    window.print();
  }

  getOb() {
    return this.props.location.state;
    // let data = window.location.href.split("?")[1];
    // data = JSON.parse(decodeURIComponent(data));
    // return data;
  }

  render() {
    return (
      <div className="main-div">
        <div className="top">
          <div className="logo">
            <img src={Logo} alt="Logo" />
            <h3>Live Sloka</h3>
            <a href="mailto:loka@livekumon.com">loka@livekumon.com</a>
            <a href="https://www.livesloka.com/">https://www.livesloka.com/</a>
          </div>
          <div className="invoice-details">
            <h1>Invoice</h1>
            <div className="details">
              <span>Invoice : {this.state.invoiceID}</span>
              <span>Invoice Date : {this.state.invoiceDate}</span>
              <span>Ref : {this.state.refID}</span>
              <span>Due Date : {this.state.dueDate}</span>
              <span>Bill to : {this.state.customerName}</span>

              <div className="amount">
                <h1>
                  Amount Payable ={" "}
                  {coinify.symbol(this.state.currency) +
                    " " +
                    this.state.totalAmount +
                    "/-"}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="bottom">
          <table>
            <tbody>
              <tr>
                <th>Class name</th>
                <th>Price</th>
              </tr>
              {this.state.classes.map((val, index) => {
                return (
                  <tr key={index}>
                    <td>{val.class}</td>
                    <td>
                      {coinify.symbol(this.state.currency) + " " + val.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br></br>
          <table>
            <tbody>
              <tr>
                <td> Total Amount</td>
                <td>
                  {coinify.symbol(this.state.currency) +
                    " " +
                    this.state.totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
          <span>Note : {this.state.note}</span>
        </div>
        <Divider />
      </div>
    );
  }
}

export default InvoiceGenerator;
