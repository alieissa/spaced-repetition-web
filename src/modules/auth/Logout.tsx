/** @format */

import { useEffect } from 'react'
import { useLogout } from './auth.hooks'

export default function Logout() {
  const [__, logout] = useLogout()

  useEffect(() => {
    logout()
  }, [])

  return null
}
