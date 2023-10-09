/** @format */

import { useSelector } from 'react-redux'
import * as api from '../../api'
import * as Select from './signup.selectors'
import { NSignup } from './signup.types'

export function useSignUp() {
  const status = useSelector(Select.status)
  const signup = api.request<NSignup.User>({ method: 'POST', url: 'users/register' })

  return { status,  signup }
}
