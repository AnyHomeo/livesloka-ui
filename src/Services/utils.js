import momentTZ from "moment-timezone"
import moment from "moment"
import days from "./days.json"

export const showError = (error, enqueueSnackbar) => {
	console.error(error)
	return enqueueSnackbar(
		typeof error === "string"
			? error
			: error?.response?.data?.message || JSON.stringify(error?.response?.data || error),
		{
			variant: "error",
		}
	)
}

export const retrieveMeetingLink = (schedule) => {
	if (schedule) {
		const {meetingLink, meetingLinks} = schedule
		const day = momentTZ().tz("Asia/Kolkata").format("dddd").toLowerCase()
		if (typeof meetingLinks === "object") {
			if (meetingLinks[day]?.link) {
				return meetingLinks[day]?.link
			} else {
				let link
				let dayIndex = days.indexOf(day)
				if (dayIndex !== -1) {
					let nextDaysOrder = [...days.slice(dayIndex + 1), ...days.slice(0, dayIndex)]
					for (let i = 0; i < nextDaysOrder.length; i++) {
						const nextDay = nextDaysOrder[i]
						if (meetingLinks[nextDay]?.link) {
							link = meetingLinks[nextDay]?.link
							break
						}
					}
					return link
				} else {
					return ""
				}
			}
		} else {
			return meetingLink || ""
		}
	} else {
		return ""
	}
}

export const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Async: Copying to clipboard was successful!")
		},
		function (err) {
			console.error("Async: Could not copy text: ", err)
		}
	)
}

export const isFuture = (date) => {
	return moment().unix() - moment(date).unix() < 0
}

export const getDaysToAdd = (value) => {
	let todayDay = moment().get("day")
	return value >= todayDay ? value - todayDay : 7 - (todayDay - value)
}

export const replaceSpecialCharacters = (str) => str.replace(/[^\w\s]/gi, '')