/** @format */

import { useSelector } from 'react-redux'
import * as api from 'src/api'
import * as Select from './login.selectors'
import { NLogin } from './login.types'

export default function useLogin() {
  const status = useSelector(Select.status)
  const login = api.request<NLogin.User>({ method: 'POST', url: 'users/login' })

  return { status,  login }
}
