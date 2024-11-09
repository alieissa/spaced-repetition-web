/** @format */

import { useMutation, useQuery } from 'react-query'
import useAppContext from 'src/app.hooks'

export function useLoginMutation() {
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('login', data),
  })

  return mutation
}

export function useUserLogoutQuery() {
  const { api } = useAppContext()

  const results = useQuery({
    queryKey: 'user-logout',
    queryFn: () => api.get('logout'),
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
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordForm) =>
      api.post('forgot-password', data),
  })

  return mutation
}

export function useResetPasswordMutation() {
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordForm) =>
      api.post('reset-password', data),
  })

  return mutation
}