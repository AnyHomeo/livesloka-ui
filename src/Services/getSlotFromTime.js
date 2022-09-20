export const getSlotFromTime = (date) => {
	let daysarr = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	let newDate = new Date(date)
	let dayToday = newDate.getDay()
	let hoursRightNow = newDate.getHours()
	let minutesRightNow = newDate.getMinutes()
	let secondsRightNow = newDate.getSeconds()
	let isAm = hoursRightNow < 12
	hoursRightNow = !isAm ? hoursRightNow - 12 : hoursRightNow
	let is30 = minutesRightNow > 30
	let secondsLeft =
		(is30 ? 59 - minutesRightNow : 29 - minutesRightNow) * 60 + (60 - secondsRightNow)
	if ((hoursRightNow === 11) & is30) {
		return {
			slot: `${daysarr[dayToday]}-11:30 ${isAm ? "AM" : "PM"}-12:00 ${!isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	} else if (hoursRightNow === 12 && is30) {
		return {
			slot: `${daysarr[dayToday]}-12:30 ${isAm ? "AM" : "PM"}-01:00 ${isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	} else {
		return {
			slot: `${daysarr[dayToday]}-${("0" + hoursRightNow).slice(-2)}${is30 ? ":30" : ":00"} ${
				isAm ? "AM" : "PM"
			}-${is30 ? ("0" + (hoursRightNow + 1)).slice(-2) : ("0" + hoursRightNow).slice(-2)}${
				is30 ? ":00" : ":30"
			} ${isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	}
}
