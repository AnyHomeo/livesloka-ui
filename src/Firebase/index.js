import firebase from "firebase"
import "firebase/storage"

const config = {
	apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUERMENT_ID,
}

firebase.initializeApp(config)
const storage = firebase.storage()
export {storage, firebase}
