/** @format */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthRequest } from '../auth/auth.hooks'
import * as Select from './decks.selectors'
export function useDecks() {
  const status = useSelector(Select.status)
  const decks = useSelector(Select.decks)
  const dispatch = useDispatch()
  const getDecks = useAuthRequest({ method: 'GET', url: 'decks' })

  useEffect(() => {
    dispatch({
      type: 'GetDecks',
    })
    getDecks().then((result) =>
      dispatch({
        type: 'DecksLoaded',
        result,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, decks }
}
