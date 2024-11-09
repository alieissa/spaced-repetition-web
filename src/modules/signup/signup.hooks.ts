/** @format */

import { useMutation } from 'react-query'
import useAppContext from 'src/app.hooks'

export function useSignupMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api_.post('signup', data),
  })

  return mutation
}