/** @format */

import { useMutation, useQuery } from 'react-query'
import useAppContext from 'src/app.hooks'

export function useLoginMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api_.post('login', data),
  })

  return mutation
}

export function useUserLogoutQuery() {
  const { api: api_ } = useAppContext()

  const results = useQuery({
    queryKey: 'user-logout',
    queryFn: () => api_.get('logout'),
    enabled: false
  })

  return results
}

// export function useLogout(): [NAuth.State['logoutStatus'], VoidFunction] {
//   const dispatch = useDispatch()
//   const status = useSelector(Select.logoutStatus)

//   const logoutCall = api.request({ method: 'GET', url: 'users/logout' })

//   const logout = () => {
//     dispatch({
//       type: 'Logout',
//     })

//     logoutCall().then((result) => {
//       dispatch({
//         type: 'LoggedOut',
//         result,
//       })
//     })
//   }

//   return [status, logout]
// }

export function useForgotPasswordMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordForm) =>
      api_.post('forgot-password', data),
  })

  return mutation
}

export function useResetPasswordMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordForm) =>
      api_.post('reset-password', data),
  })

  return mutation
}