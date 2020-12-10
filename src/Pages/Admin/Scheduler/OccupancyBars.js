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
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card style={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="h4"
                          align={"center"}
                          style={{ textTransform: "uppercase" }}
                        >
                          {category}
                        </Typography>
                        <List>
                          {Object.keys(categorizedData[category]).map(
                            (teacher) => {
                              let val;
                              let {
                                availableSlots,
                                scheduledSlots,
                                id,
                              } = categorizedData[category][teacher];
                              if (
                                !availableSlots.length &&
                                !scheduledSlots.length
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
                                <ListItem
                                  button
                                  key={teacher}
                                  onClick={() => {
                                    setTeacher(teacher);
                                    setTeacherId(id);
                                    setCategory(category);
                                  }}
                                  style={{ flexDirection: "column" }}
                                >
                                  <Typography
                                    color="textSecondary"
                                    style={{ width: "100%" }}
                                  >
                                    {teacher}
                                  </Typography>
                                  <LinearProgressWithLabel value={val} />
                                </ListItem>
                              );
                            }
                          )}
                        </List>
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
