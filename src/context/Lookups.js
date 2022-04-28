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

    const fetchAllLookups = useCallback(async () => {
        const lookups = await getLookups()
        setLookups(lookups)
    },[])

	useEffect(() => {
        fetchAllLookups()
    }, [fetchAllLookups])

	return <LookupContext.Provider value={{...lookups}}>{children}</LookupContext.Provider>
}
