import {createContext, useCallback, useEffect, useState} from "react"
import { getLookups } from '../Services/Services'
const initialState = {
	classStatusLookup: {},
	agentLookup: {},
	timeZoneLookup: {},
	classLookup: {},
	subjectLookup: {},
	teachersLookup: {},
	countriesLookup: {},
	currencyLookup: {},
	categoryDropdown: {},
}

export const LookupContext = createContext(initialState)

export const LookupContextProvider = ({children}) => {
	const [lookups, setLookups] = useState({})
	console.log("hello")
    const fetchAllLookups = useCallback(async () => {
        const lookups = await getLookups()
		console.log(lookups.data.result)
        setLookups(lookups.data.result)
    },[])

	useEffect(() => {
        fetchAllLookups()
    }, [fetchAllLookups])

	return <LookupContext.Provider value={{...lookups}}>{children}</LookupContext.Provider>
}
