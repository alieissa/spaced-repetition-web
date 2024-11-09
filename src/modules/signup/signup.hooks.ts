/** @format */

import { useMutation } from 'react-query'
import useAppContext from 'src/app.hooks'

export function useSignupMutation() {
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('signup', data),
  })

  return mutation
}