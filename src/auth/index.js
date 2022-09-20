export const authenticate = (data, remember, next) => {
	if (typeof window !== "undefined") {
		let expiry = new Date().getTime + 24 * 60 * 60 * 1000
		if (remember) {
			expiry = expiry * 5
		}
		document.cookie = `user=${JSON.stringify(data)};expires=${new Date(expiry)}path=/`
		next()
	}
}

export const isAutheticated = () => {
	let data = document.cookie.split(";")
	for (var i = 0; i < data.length; i++) {
		if (data[i].includes("user=")) {
			var userObject = data[i].split("=")[1]
		}
	}
	if (userObject) {
		return JSON.parse(userObject)
	} else {
		return false
	}
}
