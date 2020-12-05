import React, { useState, useEffect } from 'react'
import { getTeachersStudents } from '../Services/Services'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export const TeachersStudents = () => {

    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };

    useEffect(() => {
        getTeachers();

    }, []);

    const getTeachers = async () => {
        console.log("useEffect is workingg");
        getTeachersStudents()
            .then((data) => {
                console.log(data.data.result);

            })
            .catch((err) => {
                console.log(err);
            })
    }

    function FormRow() {
        return (
            <React.Fragment>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>item</Paper>
                </Grid>
            </React.Fragment>
        );
    }

    return (
        // <Grid container spacing={2}>
        //     <Grid container item xs={12} spacing={3}>
        //         <FormRow />
        //     </Grid>
        // </Grid>
        <Grid container item xs={12} spacing={3}>
            <FormRow />
        </Grid>
    );
};
export default TeachersStudents



