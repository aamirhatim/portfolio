import { createContext, SetStateAction, useContext } from "react"

export interface AppContextInterface {
    navSelect: string,
    setNavSelect: React.Dispatch<SetStateAction<string>>,
    imgUrlCache: Map<string, string>,
    setImgUrlCache: React.Dispatch<SetStateAction<Map<string, string>>>,
}

export const AppContext = createContext<AppContextInterface | undefined>(undefined)

export function useAppContext() {
    const appContext = useContext(AppContext)

    if (appContext === undefined) {
        throw new Error("useAppContext() must be used with AppContext set")
    }

    return appContext
}