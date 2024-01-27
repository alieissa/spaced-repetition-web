/** @format */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import * as Select from './decks.selectors'
export function useDecks() {
  const status = useSelector(Select.status)
  const decks = useSelector(Select.decks)
  const dispatch = useDispatch()
  const getDecks = api.request({ method: 'GET', url: 'decks' })
  
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
