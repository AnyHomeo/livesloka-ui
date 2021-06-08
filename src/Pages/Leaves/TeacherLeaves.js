import MaterialTable from 'material-table';
import React from 'react';
import useWindowDimensions from './../../Components/useWindowDimensions';
import { getAllTeacherLeaves } from './../../Services/Services';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Axios from 'axios';
import { isAutheticated } from '../../auth';
let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function TeacherLeaves() {
	const { height } = useWindowDimensions();
	const [rows, setRows] = useState([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		getAllTeacherLeaves()
			.then((data) => {
				setRows(data.data.result);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [refresh]);

	return (
		<div>
			<h1
				style={{
					textAlign: 'center',
				}}
			>
				{' '}
				Leaves Applied by Teachers{' '}
			</h1>
			<Button style={{ marginLeft: '20px' }} color="primary" variant="contained">
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
					onRowUpdate: (newData, oldData) => {},
					onRowDelete: (oldData) => {},
				}}
			/>
		</div>
	);
}

export default TeacherLeaves;
