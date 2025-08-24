import { SetStateAction } from "react";

export interface RouterContext {
    navSelect?: string,
    setNavSelect?: React.Dispatch<SetStateAction<any>>
}