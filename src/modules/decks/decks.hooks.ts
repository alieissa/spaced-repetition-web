/** @format */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDecks } from './decks.actions'
import * as Select from './decks.selectors'
export function useDecks() {
  const status = useSelector(Select.status)
  const decks = useSelector(Select.decks)
  const dispatch = useDispatch()
  useEffect(() => {
    getDecks(dispatch)
  }, [])

  return { status, decks }
}
