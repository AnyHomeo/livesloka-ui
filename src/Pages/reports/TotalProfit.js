import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
} from "@material-ui/core";
import InsertChartIcon from "@material-ui/icons/InsertChartOutlined";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: "#c0392b",
    height: 56,
    width: 56,
  },
}));

const TotalProfit = ({ failed, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              FAILED TRANSACTIONS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {failed}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string,
};

export default TotalProfit;
