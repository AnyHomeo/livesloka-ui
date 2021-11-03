import times from "../../../Services/times.json"

export const getNewSlots = (slots, direction) => {
	return Object.keys(slots).reduce((acc, day) => {
		if (slots[day].length) {
			let strippedTimes = slots[day].map((slot) => slot.split(`${day.toUpperCase()}-`)[1])
			console.log(strippedTimes)
			for (let i = 0; i < times.length; i++) {
				const time = times[i]
				if (strippedTimes.includes(time) && direction === "up" && times[i - 2] && times[i - 1]) {
					acc[day] = [
						`${day.toUpperCase()}-${times[i - 2]}`,
						`${day.toUpperCase()}-${times[i - 1]}`,
					]
					break
				} else if (
					strippedTimes.includes(time) &&
					direction === "down" &&
					times[i + 2] &&
					times[i + 1]
				) {
					acc[day] = [
						`${day.toUpperCase()}-${times[i + 2]}`,
						`${day.toUpperCase()}-${times[i + 1]}`,
					]
					break
				}
			}
		} else {
			acc[day] = []
		}
		return acc
	}, {})
}
