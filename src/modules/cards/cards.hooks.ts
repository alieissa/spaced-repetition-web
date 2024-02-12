/** @format */

import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { NDecks } from '../decks/decks.types'
import * as Select from './cards.selectors'
import { NCards } from './cards.types'

type Params = [
  NCards.State['checkStatus'][string],
  NCards.State['check'][string],
  (answer: { answer: string }) => void,
]
export function useCardById(
  deckId: NDecks.Deck['id'],
  id: NCards.Card['id'],
): Params {
  const dispatch = useDispatch()
  const postAnswerCheck = api.request({
    method: 'POST',
    url: `decks/${deckId}/cards/${id}/answers/check`,
  })

  const status = useSelector(Select.checkStatus(id))
  const check = useSelector(Select.check(id))

  const checkAnswer = (answer: { answer: string }) => {
    dispatch({
      type: 'CheckAnswer',
      id,
    })

    postAnswerCheck(answer).then((result) => {
      dispatch({
        type: 'AnswerChecked',
        result,
        id,
      })
    })
  }

  return [status, check, checkAnswer]
}
