import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Card,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Switch,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Edit, Trash2, ArrowRightCircle, XCircle } from "react-feather";
import { getData, updateLeave, editField } from "../../../../Services/Services";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    margin: "0 auto",
    marginTop: 5,
    marginBottom: 5,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: 20,
  },
  expanded: {},
  content: {
    "&$expanded": {
      marginBottom: 0,
      display: "flex",
      justifyContent: "space-between",
    },
  },
  subTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  noStudent: {
    fontSize: 14,
    opacity: 0.8,
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  subInfo: {
    opacity: 0.8,
  },

  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
  },

  card1: {
    height: 40,
    display: "flex",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#2980b9",
    color: "white",
    borderRadius: 0,
    border: "1px solid #2980b9",
    marginTop: -5,
    flex: 0.4,
  },

  card2: {
    height: 40,
    display: "flex",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#ecf0f1",
    color: "black",
    border: "1px solid #2980b9",
    borderRadius: 0,
    marginTop: -5,
    flex: 0.6,
  },

  editText: {
    height: 30,
    display: "flex",
    alignItems: "center",
    marginTop: -5,
    flex: 0.6,
  },
}));

const TeacherDetailsTableMobile = ({
  data,
  categoryData,
  statusData,
  getbackdata,
}) => {
  const classes = useStyles();

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const [editOption, setEditOption] = useState(false);

  const [selectedDate, setSelectedDate] = React.useState(data.cancelledDate);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onSubmitData = async () => {
    setLoading(true);

    setLoading(false);
  };

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }

  function humanReadable(name) {
    var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || [];

    return words.map(capitalize).join(" ");
  }

  const [textFieldData, setTextFieldData] = useState();

  useEffect(() => {
    setTextFieldData(data);
    setTextFieldData((prev) => {
      return {
        ...prev,
        isDemoIncludedInSalaries:
          data.isDemoIncludedInSalaries === ""
            ? false
            : data.isDemoIncludedInSalaries,
      };
    });
  }, [data]);

  const updateData = async () => {
    const res = await editField(`Update Teacher`, textFieldData);

    if (res.status === 200) {
      getbackdata(res.status);
      setEditOption(false);
    }
  };

  return (
    <div className={classes.root}>
      {data && (
        <Accordion>
          <AccordionSummary
            classes={{ content: classes.content, expanded: classes.expanded }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography className={classes.heading}>
                {data?.TeacherName}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {Object.keys(data).map((k, i) => {
                if (humanReadable(k) === "Id") {
                  return null;
                }
                if (humanReadable(k) === "Teacher Image Link") {
                  return null;
                }

                if (humanReadable(k) === "Category") {
                  return (
                    <div key={i} className={classes.cardContainer}>
                      <Card className={classes.card1}>
                        <p style={{ marginLeft: 5, fontSize: 12 }}>
                          {humanReadable(k)}
                        </p>
                      </Card>
                      {editOption ? (
                        <>
                          <FormControl
                            size="small"
                            variant="outlined"
                            className={classes.editText}
                          >
                            <Select
                              style={{ minWidth: "100%" }}
                              value={textFieldData[k]}
                              onChange={(e) => {
                                e.persist();
                                setTextFieldData((prev) => {
                                  return {
                                    ...prev,
                                    [k]: e.target.value,
                                  };
                                });
                              }}
                            >
                              {categoryData &&
                                categoryData?.data?.result?.map((cat) => {
                                  return (
                                    <MenuItem value={cat.id}>
                                      {cat.categoryName}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </>
                      ) : (
                        <Card className={classes.card2}>
                          {categoryData &&
                            categoryData?.data?.result?.map((cat) => {
                              if (cat.id === data.category) {
                                return (
                                  <p style={{ marginLeft: 5, fontSize: 12 }}>
                                    {cat.categoryName}
                                  </p>
                                );
                              }
                            })}
                        </Card>
                      )}
                    </div>
                  );
                }

                if (humanReadable(k) === "Teacher Status") {
                  return (
                    <div key={i} className={classes.cardContainer}>
                      <Card className={classes.card1}>
                        <p style={{ marginLeft: 5, fontSize: 12 }}>
                          {humanReadable(k)}
                        </p>
                      </Card>
                      {editOption ? (
                        <>
                          <FormControl
                            size="small"
                            variant="outlined"
                            className={classes.editText}
                          >
                            <Select
                              style={{ minWidth: "100%" }}
                              value={textFieldData[k]}
                              onChange={(e) => {
                                e.persist();
                                setTextFieldData((prev) => {
                                  return {
                                    ...prev,
                                    [k]: e.target.value,
                                  };
                                });
                              }}
                            >
                              {statusData &&
                                statusData?.data?.result?.map((cat) => {
                                  return (
                                    <MenuItem value={cat.statusId}>
                                      {cat.statusName}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </>
                      ) : (
                        <Card className={classes.card2}>
                          {statusData &&
                            statusData?.data?.result?.map((cat) => {
                              if (cat.statusId === data.TeacherStatus) {
                                return (
                                  <p style={{ marginLeft: 5, fontSize: 12 }}>
                                    {cat.statusName}
                                  </p>
                                );
                              }
                            })}
                        </Card>
                      )}
                    </div>
                  );
                }

                if (humanReadable(k) === "Is Demo Included In Salaries") {
                  return (
                    <div key={i} className={classes.cardContainer}>
                      <Card
                        className={classes.card1}
                        style={{ flex: editOption ? 0.48 : 0.4 }}
                      >
                        <p style={{ marginLeft: 5, fontSize: 12 }}>
                          {humanReadable(k)}
                        </p>
                      </Card>
                      {editOption ? (
                        <div>
                          <Switch
                            style={{
                              position: "absolute",
                              display: "flex",
                              alignItems: "center",
                              flex: 0.6,
                            }}
                            checked={textFieldData[k]}
                            onChange={(e) => {
                              e.persist();
                              setTextFieldData((prev) => {
                                return {
                                  ...prev,
                                  [k]: e.target.checked,
                                };
                              });
                            }}
                            color="primary"
                          />
                        </div>
                      ) : (
                        <Card className={classes.card2}>
                          <p style={{ marginLeft: 5, fontSize: 12 }}>
                            {data[k] ? "Yes" : "NO"}
                          </p>
                        </Card>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={i} className={classes.cardContainer}>
                    <Card className={classes.card1}>
                      <p style={{ marginLeft: 5, fontSize: 12 }}>
                        {humanReadable(k)}
                      </p>
                    </Card>
                    {editOption ? (
                      <>
                        <TextField
                          size="small"
                          variant="outlined"
                          className={classes.editText}
                          onChange={(e) => {
                            e.persist();
                            setTextFieldData((prev) => {
                              return {
                                ...prev,
                                [k]: e.target.value,
                              };
                            });
                          }}
                          value={textFieldData[k]}
                        />
                      </>
                    ) : (
                      <Card className={classes.card2}>
                        <p style={{ marginLeft: 5, fontSize: 12 }}>{data[k]}</p>
                      </Card>
                    )}
                  </div>
                );
              })}

              {/* <div>
              <div className={classes.flexContainer}></div>

              <div style={{ marginTop: 5 }}>
                <p className={classes.subTitle}>
                  Desc:{" "}
                  <span className={classes.subInfo}>{data.TeacherDesc}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Status:{" "}
                  {statusData &&
                    statusData?.data?.result?.map((cat) => {
                      if (cat.statusId === data.TeacherStatus) {
                        return (
                          <span className={classes.subInfo}>
                            {cat.statusName}
                          </span>
                        );
                      }
                    })}
                </p>

                <p className={classes.subTitle}>
                  Category:{" "}
                  {categoryData &&
                    categoryData?.data?.result?.map((cat) => {
                      if (cat.id === data.category) {
                        return (
                          <span className={classes.subInfo}>
                            {cat.categoryName}
                          </span>
                        );
                      }
                    })}
                </p>

                <p className={classes.subTitle}>
                  Mail:{" "}
                  <span className={classes.subInfo}>{data.teacherMail}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Salary Till Now:{" "}
                  <span className={classes.subInfo}>{data.Salary_tillNow}</span>{" "}
                </p>
                <p className={classes.subTitle}>
                  Commission Amount One:{" "}
                  <span className={classes.subInfo}>
                    {data.Commission_Amount_One}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Commission Amount Many:{" "}
                  <span className={classes.subInfo}>
                    {data.Commission_Amount_Many}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Bank:{" "}
                  <span className={classes.subInfo}>{data.Bank_account}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Phone:{" "}
                  <span className={classes.subInfo}>{data.Phone_number}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Bank Full Name:{" "}
                  <span className={classes.subInfo}>{data.Bank_full_name}</span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Include Demo Class In Salaries:{" "}
                  <span className={classes.subInfo}>
                    {data.isDemoIncludedInSalaries}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>
                  Leave Difference Hours:{" "}
                  <span className={classes.subInfo}>
                    {data.leaveDifferenceHours}
                  </span>{" "}
                </p>

                <p className={classes.subTitle}>Teacher Image: </p>
                <img
                  style={{
                    height: 60,
                    width: 60,
                    objectFit: "contain",
                    display: "block",
                  }}
                  src={data.teacherImageLink}
                  alt=""
                />
                <IconButton onClick={() => setEditableDate(true)}>
                  <Edit style={{ marginRight: 10, color: "#34495e" }} />
                  <Trash2 style={{ color: "#e74c3c" }} />
                </IconButton>
              </div>
            </div> */}
              <div>
                {editOption ? (
                  <>
                    <IconButton onClick={updateData}>
                      <ArrowRightCircle style={{ color: "#2ecc71" }} />
                    </IconButton>
                    <IconButton onClick={() => setEditOption(!editOption)}>
                      <XCircle />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => setEditOption(!editOption)}>
                    <Edit style={{ marginRight: 10, color: "#34495e" }} />
                  </IconButton>
                )}

                <IconButton>
                  <Trash2 style={{ color: "#e74c3c" }} />
                </IconButton>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      )}

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={success ? "success" : "warning"}
        >
          {response}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeacherDetailsTableMobile;
