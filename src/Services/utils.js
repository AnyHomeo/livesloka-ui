import momentTZ from "moment-timezone"
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
	const { meetingLink, meetingLinks } = schedule
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
		return meetingLink || ''
	} 
}
