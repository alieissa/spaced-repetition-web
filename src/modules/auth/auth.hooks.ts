/** @format */

import { Dispatch } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { Async } from 'src/utils/async'
import { LoginAction } from './auth.actions'
import * as Select from './auth.selectors'
import { NAuth } from './auth.types'

export default function useLogin(): [
  Async<null, string, NAuth.UserToken>,
  (form: NAuth.UserForm) => void,
  VoidFunction,
] {
  const dispatch = useDispatch()
  const status = useSelector(Select.status)
  const loginRequest = api.request<NAuth.User, NAuth.UserToken>({
    method: 'POST',
    url: 'users/login',
  })

  const login = (form: NAuth.UserForm) => {
    dispatch({
      type: 'Login',
    })

    loginRequest({ email: form.email, password: form.password }).then((result) => {
      dispatch({ type: 'LoggedIn', rememberMe: form.rememberMe, result })
    })
  }

  const resetLogin = () => {
    dispatch({
      type: 'ResetLogin'
    })
  }
  return [status, login, resetLogin]
}

export function useLogout(): [NAuth.State['logoutStatus'], VoidFunction] {
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


export function useForgotPassword(): [
  NAuth.State['notifyForgotPasswordStatus'],
  (data: NAuth.ForgotPasswordForm) => void,
] {
  const dispatch = useDispatch<Dispatch<LoginAction>>()
  const status = useSelector(Select.notifyForgotPasswordStatus)

  useEffect(() => {
    return () => {
      dispatch({ type: 'ResetNotifyForgotPassword' })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const forgotPasswordCall = api.request<NAuth.ForgotPasswordForm, null>({
    method: 'POST',
    url: 'users/forgot-password',
  })

  const forgotPassword = (data: NAuth.ForgotPasswordForm) => {
    dispatch({
      type: 'NotifyForgotPassword',
    })

    forgotPasswordCall(data).then((result) => {
      dispatch({
        type: 'ForgotPasswordNotified',
        result,
      })
    })
  }

  return [status, forgotPassword]
}

type Password = Pick<NAuth.ResetPasswordForm, 'password'>
export function useResetPassword(): [
  NAuth.State['resetPasswordStatus'],
  (data: Password) => void,
] {
  const dispatch = useDispatch<Dispatch<LoginAction>>()
  const status = useSelector(Select.resetPasswordStatus)

  useEffect(() => {
    return () => {
      dispatch({ type: 'ResetResetPassword' })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetPasswordCall = api.request<Password, null>({
    method: 'POST',
    url: 'users/reset-password',
  })

  const resetPassword = (data: Password) => {
    dispatch({
      type: 'ResetPassword',
    })

    resetPasswordCall(data).then((result) => {
      dispatch({
        type: 'PasswordReset',
        result,
      })
    })
  }

  return [status, resetPassword]
}
