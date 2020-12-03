/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Divider,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
import SendIcon from "@material-ui/icons/Send";
import { updateComment } from "../../../Services/Services";
import { isAutheticated } from "../../../auth";
import MuiAlert from "@material-ui/lab/Alert";

function SingleComment(props) {
  const {
    comment,
    commentStatus,
    _id,
    id,
    timeStamp,
    auditUserId,
    statuses,
    setComments,
  } = props;

  const [text, setText] = useState(comment);
  const [status, setStatus] = useState(commentStatus);
  const [editing, setEditing] = useState(false);
  const [time, setTime] = useState(timeStamp);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const updateThisComment = () => {
    updateComment({
      _id,
      comment: text,
      commentStatus: status,
      customerId: id,
      timeStamp: new Date(),
      auditUserId: isAutheticated().userId,
    })
      .then((data) => {
        if (data.data.status === "OK") {
          setComments((prev) => {
            let prevData = [...prev]
            var index = 0
            for (var i = 0; i < prevData.length; i++) {
              if (prevData[i].commentId === data.data.result.commentId) {
                index = i
              }
            }
            prevData[index] = data.data.result
            return prevData
          });
          setEditing(false);
          setTime(new Date());
          setSuccess(true);
          setResponse(data.data.message);
          setOpen(true);
        } else {
          setSuccess(false);
          setResponse(data.data.message || "something went wrong, Try again");
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setResponse("something went wrong, Try again");
        setOpen(true);
      });
  };

  return (
    <Grid item sm={12} xs={12} md={4}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={success ? "success" : "warning"}>
          {response}
        </Alert>
      </Snackbar>
      <Card style={{ padding: "20px" }}>
        <Typography variant="h5">
          {auditUserId ? auditUserId : "Admin User"}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "grey" }}>
          {moment(time).fromNow()} | {statuses[status]}
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />
        {editing ? (
          <>
            <TextField
              id="comment"
              label="Comment"
              multiline
              rows={2}
              variant="outlined"
              autoFocus
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <FormControl style={{ width: "100%", padding: "20px 0" }}>
              <InputLabel id="select-status">Select Status</InputLabel>
              <Select
                labelId="select-status"
                id="select-status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.keys(statuses).map((statusId, i) => {
                  return (
                    <MenuItem value={statusId} key={i}>
                      {" "}
                      {Object.values(statuses)[i]}{" "}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        ) : (
            <Typography
              onDoubleClick={() => setEditing(true)}
              style={{ marginTop: "20px" }}
            >
              {text}
            </Typography>
          )}
        <CardActions style={{ marginTop: "20px", float: "right" }}>
          {editing ? (
            <>
              <Button
                color="secondary"
                varient="outlined"
                endIcon={<CancelIcon />}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                endIcon={<SendIcon />}
                onClick={() => updateThisComment()}
              >
                Submit
              </Button>
            </>
          ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  endIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit
              </Button>
                {/* <Button
                  color="secondary"
                  varient="outlined"
                  endIcon={<DeleteIcon />}
                  onClick={() => deleteThisComment()}
                >
                  Delete
              </Button> */}
              </>
            )}
        </CardActions>
      </Card>
    </Grid>
  );
}

export default SingleComment;
