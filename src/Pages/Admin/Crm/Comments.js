/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  getComments,
  updateComment,
  addComments,
  deleteComment,
} from "../../../Services/Services";
import { useState } from "react";
import { Grid, Card, Typography, Button, Snackbar } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import SingleComment from "./SingleComment";
import { isAutheticated } from "../../../auth";
import MuiAlert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";

// function Comments(props) {
//   const [comments, setComments] = useState([]);
//   const [statuses, setStatuses] = useState({});
//   const [newComment, setNewComment] = useState("");
//   const [status, setStatus] = useState("");
//   const [open, setOpen] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [response, setResponse] = useState("");

//   function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
//   }

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpen(false);
//   };

//   let id = props.id;
//   let name = props.name || "demo";

//   useEffect(() => {
//     getComments(id)
//       .then((fetchedData) => {
//         console.log(fetchedData);
//         setComments(fetchedData.data.result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     getData("Status").then((fetchedData) => {
//       fetchedData.data.result.forEach((obj) => {
//         setStatuses((prev) => {
//           return { ...prev, [obj["statusId"]]: obj["statusName"] };
//         });
//       });
//     });
//   }, [id]);

//   const addNewComment = () => {
//     addComments({
//       comment: newComment,
//       commentStatus: 1,
//       customerId: id,
//       timeStamp: new Date(),
//       auditUserId: isAutheticated().userId,
//     })
//       .then((fetchedData) => {
//         console.log(fetchedData);
//         if (fetchedData.data.status === "ok") {
//           setComments((prev) => [...prev, fetchedData.data.result]);
//           setNewComment("");
//           setStatus("");
//           setSuccess(true);
//           setResponse(fetchedData.data.message);
//           setOpen(true);
//         } else {
//           setSuccess(false);
//           setResponse(
//             fetchedData.data.message || "something went wrong, Try again"
//           );
//           setOpen(true);
//         }
//       })
//       .catch((err) => {
//         console.log(err, err.response);
//         setSuccess(false);
//         setResponse("something went wrong, Try again");
//         setOpen(true);
//       });
//   };
//   return (
//     <Grid container spacing={5} style={{ padding: "30px" }}>
//       <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//         <Alert onClose={handleClose} severity={success ? "success" : "warning"}>
//           {response}
//         </Alert>
//       </Snackbar>
//       <Grid item sm={6} xs={12} md={3} lg={3}>
//         <Card style={{ padding: "20px" }}>
//           <Typography color="textPrimary" gutterBottom>
//             Add New Comment to {name}
//           </Typography>
//           <TextField
//             id="comment"
//             label="Comment"
//             multiline
//             rows={4}
//             variant="outlined"
//             autoFocus
//             fullWidth
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <Button
//             style={{ display: "block", marginTop: "10px" }}
//             variant="contained"
//             color="primary"
//             onClick={() => addNewComment()}
//           >
//             Add Comment
//           </Button>
//         </Card>
//       </Grid>
//       <Grid item sm={6} xs={12} md={9} lg={9}>
//         <Grid container spacing={7}>
//           {comments
//             .map((comment, i) => (
//               <SingleComment
//                 key={i}
//                 {...comment}
//                 statuses={statuses}
//                 id={id}
//                 setComments={setComments}
//               />
//             ))
//             .reverse()}
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// }

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

  parseDate() {}

  getDate() {
    let y = new Date();

    return y.getDay() + "-" + y.getMonth() + "-" + y.getFullYear();
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
