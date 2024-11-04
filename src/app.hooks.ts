import { createContext, useContext } from 'react'
import type { AppContext as AppContextType } from './types'
// import AppContext from './app.context'

const AppContext = createContext<AppContextType | null>(null)

const useAppContext = () => {
  const currentAppContext = useContext(AppContext)

  if (!currentAppContext) {
    throw new Error(
      'useAppContext has to be used within <AppContext.Provider>',
    )
  }

  return currentAppContext
}

export default useAppContext
