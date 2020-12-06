/* eslint-disable no-unused-vars */
import React from "react";
import {
  getComments,
  updateComment,
  addComments,
  deleteComment,
} from "../../../Services/Services";
import { isAutheticated } from "../../../auth";
import MaterialTable from "material-table";

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
    };

    this.fetchData();
  }

  async fetchData() {
    let { data } = await getComments(this.props.id);

    let change = (prevState) => {
      prevState.comments = data.result;
      return prevState;
    };

    this.setState(change);
  }

  getDate() {
    let y = new Date();
    return (
      y.getDay() +
      "-" +
      y.getMonth() +
      "-" +
      y.getFullYear() +
      " " +
      y.getHours() +
      ":" +
      y.getMinutes()
    );
  }

  render() {
    return (
      <MaterialTable
        options={{
          grouping: true,
          pageSize: 10,
        }}
        data={this.state.comments}
        title={"Comments of " + this.props.name}
        columns={[
          { title: "Comment", field: "comment" },
          {
            title: "Agent ID",
            field: "auditUserId",
            editComponent: (props) => <span>{props.value}</span>,
          },
          {
            title: "Time Stamp",
            field: "timeStamp",
            editComponent: (props) => <span>{props.value}</span>,
          },
        ]}
        editable={{
          onRowAdd: (newData) => {
            return addComments({
              comment: newData.comment,
              commentStatus: 1,
              customerId: this.props.id,
              timeStamp: this.getDate(),
              auditUserId: isAutheticated().userId,
            })
              .then((fetchedData) => {
                this.fetchData();
                return fetchedData;
              })
              .catch((err) => {
                return err;
              });
          },
          onRowUpdate: (newData, oldData) =>
            updateComment(newData)
              .then((fetchedData) => {
                this.fetchData();
                return fetchedData;
              })
              .catch((err) => {
                return err;
              }),
          onRowDelete: (oldData) =>
            deleteComment(oldData)
              .then((fetchedData) => {
                this.fetchData();
                return fetchedData;
              })
              .catch((err) => {
                return err;
              }),
        }}
      ></MaterialTable>
    );
  }
}

export default Comments;
