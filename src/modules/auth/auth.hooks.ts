/** @format */

import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import * as Select from './auth.selectors'
import { NAuth } from './auth.types'

export default function useLogin() {
  const status = useSelector(Select.status)
  const login = api.request<NAuth.User>({ method: 'POST', url: 'users/login' })

  return { status, login }
}

export function useLogout():[NAuth.State['logoutStatus'], VoidFunction] {
  const dispatch = useDispatch()
  const status = useSelector(Select.logoutStatus)

  const logoutCall = api.request({ method: 'GET', url: 'users/logout' })

  const logout = () => {
    dispatch({
      type: 'Logout',
    })

    logoutCall().then((result) => {
      dispatch({
        type: 'LoggedOut',
        result,
      })
    })
  }

  return [status, logout]
}
