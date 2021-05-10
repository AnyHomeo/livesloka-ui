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
import moment from "moment";

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
            editable:"never"
          },
          {
            title: "timeStamp",
            field: "timeStamp",
            editable:"never",
            render:(rowData) => moment(rowData.timeStamp).format("MMMM Do YYYY, h:mm:ss a")
          },
        ]}
        editable={{
          onRowAdd: (newData) => {
            return addComments({
              comment: newData.comment,
              commentStatus: 1,
              customerId: this.props.id,
              timeStamp: moment().format(),
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
            updateComment({...newData,timeStamp:moment().format()})
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
