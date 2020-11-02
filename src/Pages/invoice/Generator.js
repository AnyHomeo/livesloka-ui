import { Divider } from "@material-ui/core";
import React from "react";
import Logo from "../../Images/Logo2.png";
import "../../sass/generator.scss";
import { addInvoice } from "../../Services/Services";

class InvoiceGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getOb();

    addInvoice(this.state)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    window.print();
  }

  getOb() {
    let data = window.location.href.split("?")[1];
    data = JSON.parse(decodeURIComponent(data));
    return data;
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
                <h1>Amount Payable = {this.state.totalAmount}</h1>
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
                    <td>{val.price}</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td>Total Amount : {this.state.totalAmount}</td>
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
