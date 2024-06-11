/** @format */

import { useEffect } from 'react'
import Login from './Login'
import { useLogout } from './auth.hooks'

export default function Logout() {
  const [status, logout] = useLogout()

  useEffect(() => {
    logout()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Login />
}
