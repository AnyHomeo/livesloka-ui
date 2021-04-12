import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  Chip,
} from "@material-ui/core/";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" width="100%" alignItems="center">
      <Box width="65%" mr={1}>
        <LinearProgress
          variant="determinate"
          color={props.value >= 70 ? "secondary" : "primary"}
          {...props}
        />
      </Box>
      <Box width="35%">
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}% Occupied`}</Typography>
      </Box>
    </Box>
  );
}

const OccupancyBars = ({
  setTeacher,
  setTeacherId,
  categorizedData,
  setCategory,
}) => {
  return (
    <>
      <div style={{ padding: "30px" }}>
        <Grid container spacing={3}>
          {Object.keys(categorizedData).map((category) => {
            return (
              <React.Fragment key={category}>
                {Object.keys(categorizedData[category]).length ? (
                  <Grid item xs={12} sm={4} md={4} lg={3}>
                    <Card style={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="h4"
                          align={"center"}
                          style={{ textTransform: "uppercase" }}
                        >
                          {category}
                        </Typography>
                        <Grid container direction="row">
                          {Object.keys(categorizedData[category]).map(
                            (teacher) => {
                              let val;
                              let {
                                availableSlots,
                                scheduledSlots,
                                id,
                              } = categorizedData[category][teacher];

                              if (
                                Object.keys(scheduledSlots).length === 0 &&
                                availableSlots.length === 0
                              ) {
                                val = 0;
                              } else {
                                val =
                                  (Object.keys(scheduledSlots).length /
                                    (Object.keys(scheduledSlots).length +
                                      availableSlots.length)) *
                                  100;
                              }
                              return (
                                // <Grid
                                //   item
                                //   xs={4}
                                //   style={{
                                //     display: "flex",
                                //     justifyContent: "space-around",
                                //     alignItems: "center",
                                //     marginTop: 20,
                                //   }}
                                // >
                                //   {/* <ListItem
                                //     style={{
                                //       height: "50px",
                                //       width: "100%",
                                //       background:
                                //         "linear-gradient(315deg, #3bb78f 0%, #0bab64 74%)",
                                //       marginBottom: 10,
                                //       marginLeft: 10,
                                //       display: "flex",
                                //       justifyContent: "center",
                                //       alignItems: "center",

                                //       borderRadius: 10,
                                //     }}
                                //     button
                                //     key={teacher}
                                //     onClick={() => {
                                //       setTeacher(teacher);
                                //       setTeacherId(id);
                                //       setCategory(category);
                                //     }}
                                //   >
                                //     <Typography
                                //       color="textSecondary"
                                //       style={{ color: "white" }}
                                //     >
                                //       {teacher}
                                //     </Typography>
                                //   </ListItem> */}

                                //   <Chip
                                //     onClick={() => {
                                //       setTeacher(teacher);
                                //       setTeacherId(id);
                                //       setCategory(category);
                                //     }}
                                //     label={teacher}
                                //     size="small"
                                //   />
                                // </Grid>

                                <Chip
                                  onClick={() => {
                                    setTeacher(teacher);
                                    setTeacherId(id);
                                    setCategory(category);
                                  }}
                                  style={{ margin: 5 }}
                                  label={teacher}
                                  size="small"
                                />
                              );
                            }
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  <span />
                )}
              </React.Fragment>
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default OccupancyBars;
