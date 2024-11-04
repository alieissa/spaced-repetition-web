import { createContext } from "react";
import type { AppContext as AppContextType } from "./types";

const AppContext = createContext<AppContextType | null>(null)
export default AppContext