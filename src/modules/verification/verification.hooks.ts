/** @format */

import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import useAppContext from 'src/app.hooks'

export function useVerifyUserQuery() {
  const { api: api_ } = useAppContext()

  const [queryParams, __] = useSearchParams()
  const token = queryParams.get('token') || undefined

  const result = useQuery({
    queryKey: 'verify-user',
    queryFn: () => api_.get('verify-user', { params: { token } }),
  })
  return result
}
