/** @format */

import { useReducer } from 'react'
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



type GetNextCard = {
  type: 'GET_NEXT_CARD'
}
type GetPreviousCard = {
  type: 'GET_PREVIOUS_CARD'
}
type UpdateUserAnswer = {
  type: 'UPDATE_USER_ANSWER'
  id: NCards.Card['id']
  userAnswer: string
}
type Action = GetNextCard | GetPreviousCard | UpdateUserAnswer
type State = {
  currentCardIndex: number
  cards: { id: string; question: string; userAnswer: string }[]
}
function cardTestFormReducer(state: State, action: Action) {
  switch (action.type) {
    case 'GET_NEXT_CARD': {
      const nextIndex = state.currentCardIndex + 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'GET_PREVIOUS_CARD': {
      const nextIndex = state.currentCardIndex - 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'UPDATE_USER_ANSWER': {
      const updatedCard = {
        ...state.cards[state.currentCardIndex],
        userAnswer: action.userAnswer,
      }
      const updatedCards = state.cards.map((card, index) =>
        index === state.currentCardIndex ? updatedCard : card,
      )

      return {
        ...state,
        cards: updatedCards,
      }
    }
  }
}
const getInitialState = (cards: ReadonlyArray<NCards.Card>) => {
  return {
    currentCardIndex: 0,
    cards: cards.map((card) => ({
      id: card.id,
      question: card.question,
      userAnswer: '',
    })),
  }
}
export function useCardTestFormReducer(cards: ReadonlyArray<NCards.Card>) {
  return useReducer(
    cardTestFormReducer,
    getInitialState(cards),
  )
}