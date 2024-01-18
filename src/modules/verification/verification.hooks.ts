/** @format */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import * as api from 'src/api'
import * as Select from './verification.selectors'

export function useVerification() {
  const [queryParams, __] = useSearchParams()
  const dispatch = useDispatch()
  const status = useSelector(Select.status)
  const verify = api.request({
    method: 'GET',
    url: 'users/verify',
    // get method returns string | null, we want string | undefined
    token: queryParams.get('token') || undefined
  })

  useEffect(() => {
    dispatch({
      type: 'Verify'
    })
    verify().then((result) => {
      dispatch({
        type: 'Verified',
        result
      })
    })
  }, [])

  return { status }
}
