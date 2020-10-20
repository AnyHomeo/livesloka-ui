import React from "react";

import {CardContent, Card, Typography, Grid} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Adminsidebar from "../Adminsidebar";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "100px",
        width: 275,
        margin: "0 auto"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        color: "black"
    },
    students: {
        fontSize: 16,
        marginLeft: 20,

    }
}));
const MeetingDetails = () => {
    const classes = useStyles();


    return (
        <>
            <Grid container spacing={3} justify={"center"}>

                <Grid item xs={12} md={3}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Meeting <span>1</span>
                            </Typography>

                            <Typography className={classes.title} gutterBottom>
                                Teacher: Karthik
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.students}>
                                <ol >
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal (Absent)
                                    </li>
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal
                                    </li>

                                </ol>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Meeting <span>1</span>
                            </Typography>

                            <Typography className={classes.title} gutterBottom>
                                Teacher: Karthik
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.students}>
                                <ol >
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal (Absent)
                                    </li>
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal
                                    </li>

                                </ol>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Meeting <span>1</span>
                            </Typography>

                            <Typography className={classes.title} gutterBottom>
                                Teacher: Karthik
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.students}>
                                <ol >
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal (Absent)
                                    </li>
                                    <li>
                                        Kamal
                                    </li>
                                    <li>
                                        Kamal
                                    </li>

                                </ol>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
            <Adminsidebar />



        </>
    );
};

export default MeetingDetails;
