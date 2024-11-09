import { useContext } from 'react'
import AppContext from './app.context'

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
