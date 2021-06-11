import MaterialTable from 'material-table';
import React from 'react';
import useWindowDimensions from './../../Components/useWindowDimensions';
import { deleteATeacherLeave, getAllTeacherLeaves, getData, updateTeacherLeave } from './../../Services/Services';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Chip, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Axios from 'axios';
import { isAutheticated } from '../../auth';
let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function TeacherLeaves() {
	const { width, height } = useWindowDimensions();
	const [rows, setRows] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [schedulesOfTeacher, setSchedulesOfTeacher] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [leaveData, setLeaveData] = useState({
		scheduleId: '',
		teacherId: '',
		date: new Date(),
		entireDay: false,
		isHidden: true,
	});
	const [alert, setAlert] = useState({
		isError: false,
		message: '',
	});

	useEffect(() => {
		getAllTeacherLeaves()
			.then((data) => {
				setRows(data.data.result);
			})
			.catch((error) => {
				console.log(error);
			});
		getData('Teacher')
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [refresh]);

	return (
		<div>
			<Snackbar
				open={!!alert.message}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				autoHideDuration={6000}
				onClose={() => setAlert({ isError: true, message: '' })}
			>
				<Alert
					onClose={() => setAlert({ isError: true, message: '' })}
					severity={alert.isError ? 'error' : 'success'}
					variant="filled"
				>
					{alert.message}
				</Alert>
			</Snackbar>
			<Dialog
				open={!leaveData.isHidden}
				onClose={() =>
					setLeaveData((prev) => ({
						scheduleId: '',
						teacherId: '',
						date: new Date(),
						entireDay: false,
						isHidden: true,
						editingMode: false,
					}))
				}
				fullScreen={width < 400}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Apply Leave for a Teacher</DialogTitle>
				<DialogContent>
					<Autocomplete
						id="auto-com-1"
						options={[]}
						fullWidth
						style={{
							margin: '10px 0',
							minWidth: 310,
						}}
						renderInput={(params) => <TextField {...params} label="Select Teacher" variant="outlined" />}
					/>
					<Autocomplete
						id="combo-box-demo-2"
						options={[]}
						fullWidth
						style={{
							margin: '10px 0',
							minWidth: 310,
						}}
						renderInput={(params) => (
							<TextField {...params} label="Select Schedule Of the Teacher" variant="outlined" />
						)}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={leaveData.entireDay}
								onChange={() => setLeaveData((prev) => ({ ...prev, entireDay: !prev.entireDay }))}
								name="checkedA"
							/>
						}
						label="Apply Leave for Entire Day"
					/>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<DatePicker
							margin="normal"
							fullWidth
							disablePast
							id="date-picker-dialog"
							label="Select Leave Date"
							inputVariant="outlined"
							variant="static"
							// shouldDisableDate={(date) => !(new Date(date).getDay() === value)}
							value={leaveData.date}
							onChange={(date) => {
								setLeaveData((prev) => ({ ...prev, date: new Date(date) }));
							}}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</DialogContent>
				<DialogActions>
					<Button
						variant={'contained'}
						color="secondary"
						onClick={() =>
							setLeaveData((prev) => ({
								scheduleId: '',
								teacherId: '',
								date: new Date(),
								entireDay: false,
								isHidden: true,
							}))
						}
					>
						cancel
					</Button>
					<Button variant={'contained'} color={'primary'}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
			<h1
				style={{
					textAlign: 'center',
				}}
			>
				{' '}
				Leaves Applied by Teachers{' '}
			</h1>
			<Button
				style={{ marginLeft: '20px' }}
				onClick={() => {
					setLeaveData((prev) => ({ ...prev, isHidden: false }));
				}}
				color="primary"
				variant="contained"
			>
				Apply Leave
			</Button>
			<MaterialTable
				title=""
				columns={[
					{
						title: 'Teacher',
						field: 'teacherId.TeacherName',
						type: 'string',
						editable: 'never',
					},
					{
						title: 'Class Name',
						field: 'scheduleId.className',
						editable: 'never',
						type: 'string',
						render: (row) =>
							row.scheduleId ? (
								row.scheduleId.className
							) : (
								<Chip size="small" color="secondary" label="Entire Day" />
							),
					},
					{
						title: 'Date(User TimeZone)',
						field: 'date',
						type: 'datetime',
						customFilterAndSearch: (filter, row, col) => {
							return col.render(row).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
						},
						render: (rowData) => moment(rowData.date).format('MMMM Do YYYY, h:mm:ss A'),
					},
				]}
				style={{
					margin: '20px',
					padding: '20px',
				}}
				data={rows}
				options={{
					exportButton: true,
					paging: false,
					maxBodyHeight: height - 240,
				}}
				editable={{
					onRowUpdate: (newData, oldData) =>
						updateTeacherLeave(newData._id, {
							date: newData.date,
							teacherId: newData.teacherId.id,
						})
							.then((data) => {
								setRefresh((prev) => !prev);
								setAlert({
									isError: false,
									message: data.data.message,
								});
							})
							.catch((err) => {
								console.log(err.response);
								setAlert({
									isError: true,
									message: err.response.data.error,
								});
							}),
					onRowDelete: (oldData) =>
						deleteATeacherLeave(oldData._id)
							.then((data) => {
								setRefresh((prev) => !prev);
								setAlert({
									isError: false,
									message: data.data.message,
								});
							})
							.catch((err) => {
								console.log(err.response);
								setAlert({
									isError: true,
									message: err.response.data.error,
								});
							}),
				}}
			/>
		</div>
	);
}

export default TeacherLeaves;
