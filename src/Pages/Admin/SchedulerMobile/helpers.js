import times from "../../../Services/times.json"

export const getNewSlots = (slots, direction, count) => {
	return Object.keys(slots).reduce((acc, day) => {
		if (slots[day].length) {
			let strippedTimes = slots[day].map((slot) => slot.split(`${day.toUpperCase()}-`)[1])
			console.log(strippedTimes)
			for (let i = 0; i < times.length; i++) {
				const time = times[i]
				if (
					strippedTimes.includes(time) &&
					direction === "up" &&
					times[i - count] &&
					times[i - count - 1]
				) {
					acc[day] = [
						`${day.toUpperCase()}-${times[i - count]}`,
						`${day.toUpperCase()}-${times[i - count - 1]}`,
					]
					break
				} else if (
					strippedTimes.includes(time) &&
					direction === "down" &&
					times[i + count + 1] &&
					times[i + count + 2]
				) {
					console.log("DOWN")
					acc[day] = [
						`${day.toUpperCase()}-${times[i + count + 1]}`,
						`${day.toUpperCase()}-${times[i + count + 2]}`,
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
