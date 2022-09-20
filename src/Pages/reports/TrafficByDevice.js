import React from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import {Doughnut} from "react-chartjs-2"
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Typography,
	colors,
	makeStyles,
	useTheme,
} from "@material-ui/core"
import LaptopMacIcon from "@material-ui/icons/LaptopMac"
import PhoneIcon from "@material-ui/icons/Phone"
import TabletIcon from "@material-ui/icons/Tablet"

const useStyles = makeStyles(() => ({
	root: {
		height: "100%",
	},
}))

const TrafficByDevice = ({totaltrx, failed, success, className, ...rest}) => {
	const classes = useStyles()
	const theme = useTheme()

	function percentage(percent, total) {
		return ((percent / 100) * total).toFixed(2)
	}

	const data = {
		datasets: [
			{
				data: [totaltrx, failed, success],
				backgroundColor: [colors.orange[500], colors.red[600], "#27ae60"],
				borderWidth: 8,
				borderColor: colors.common.white,
				hoverBorderColor: colors.common.white,
			},
		],
		labels: ["Total", "Failed", "Success"],
	}

	const options = {
		animation: false,
		cutoutPercentage: 80,
		layout: {padding: 0},
		legend: {
			display: false,
		},
		maintainAspectRatio: false,
		responsive: true,
		tooltips: {
			backgroundColor: theme.palette.background.default,
			bodyFontColor: theme.palette.text.secondary,
			borderColor: theme.palette.divider,
			borderWidth: 1,
			enabled: true,
			footerFontColor: theme.palette.text.secondary,
			intersect: false,
			mode: "index",
			titleFontColor: theme.palette.text.primary,
		},
	}

	const devices = [
		{
			title: "Total",
			value: percentage(totaltrx, totaltrx),
			icon: LaptopMacIcon,
			color: colors.orange[600],
		},
		{
			title: "Failed",
			value: percentage(failed, totaltrx),
			icon: TabletIcon,
			color: colors.red[600],
		},
		{
			title: "Success",
			value: percentage(success, totaltrx),
			icon: PhoneIcon,
			color: "#27ae60",
		},
	]

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardHeader title="Transaction Types" />
			<Divider />
			<CardContent>
				<Box height={300} position="relative">
					<Doughnut data={data} options={options} />
				</Box>
				<Box display="flex" justifyContent="center" mt={2}>
					{devices.map(({color, icon: Icon, title, value}) => (
						<Box key={title} p={1} textAlign="center">
							<Icon color="action" />
							<Typography color="textPrimary" variant="body1">
								{title}
							</Typography>
							<Typography style={{color}} variant="h2">
								{value}%
							</Typography>
						</Box>
					))}
				</Box>
			</CardContent>
		</Card>
	)
}

TrafficByDevice.propTypes = {
	className: PropTypes.string,
}

export default TrafficByDevice

// {data &&
//   data.data &&
//   data.data.result.map((dataa) => {
//     return (
//       <Box
//         key={dataa.customerId.classStatusId}
//         p={1}
//         textAlign="center"
//       >
//         {/* <Icon color="action" /> */}
//         <Typography color="textPrimary" variant="body1">
//           {dataa.customerId.className}
//         </Typography>
//         <Typography variant="h2">
//           {dataa.customerId.classStatusId}%
//         </Typography>
//       </Box>
//     );
//   })}
