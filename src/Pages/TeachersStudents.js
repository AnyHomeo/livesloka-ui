import React, { useState, useEffect } from 'react'
import { getTeachersStudents } from '../Services/Services'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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

const Exercise = props => (
    <tr>
        <td>{props}</td>
    </tr>
    // <tr>
    //     <td>{props.exercise.username}</td>
    //     <td>{props.exercise.description}</td>
    //     <td>{props.exercise.duration}</td>
    //     <td>{props.exercise.date.substring(0, 10)}</td>
    // </tr>
)

export const TeachersStudents = () => {

    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
    const [data, setdata] = React.useState({});

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
                setdata(data.data.result);

            })
            .catch((err) => {
                console.log(err);
            })
    }

    function FormRow() {
        var count = Object.keys(data).length;
        console.log(count);
        for (let i = 0; i < count; i++) {
            console.log(data[i]);
            return data[i].map(currentexercise => {
                return <Exercise exercise={currentexercise} key={currentexercise._id} />;
            })
        }
        // return (
        //     <React.Fragment>
        //         <Grid item xs={4}>
        //             <Paper className={classes.paper}>item</Paper>
        //         </Grid>
        //     </React.Fragment>
        // );


    }

    return (
        <Grid container item xs={12} spacing={3}>
            <div>
                <h3>Logged Exercises</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        <FormRow />
                    </tbody> */}
                </table>
            </div>

        </Grid>
    );
};
export default TeachersStudents



