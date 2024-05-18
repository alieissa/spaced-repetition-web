/** @format */

import { useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'
import { NDecks } from '../decks/decks.types'
import * as Select from './cards.selectors'
import { NCards } from './cards.types'

type Params = [
  NCards.State['checkStatus'][string],
  NCards.State['check'][string],
  (answer: { answer: string }) => void,
  (quality: number) => void
]
export function useCard(
  deckId: NDecks.Deck['id'],
  id: NCards.Card['id'],
): Params {
  const dispatch = useDispatch()
  const putCard = api.request({
    method: 'PUT',
    url: `decks/${deckId}/cards/${id}`,
  })
  const postAnswerCheck = api.request({
    method: 'POST',
    url: `decks/${deckId}/cards/${id}/answers/check`,
  })

  const checkAnswerStatus = useSelector(Select.checkStatus(id))
  const checkAnswerResult = useSelector(Select.check(id))

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

  const updateCardQuality = (quality: number) => {
    dispatch({
      type: 'UpdateCardQuality',
      id,
    })

    putCard({ quality }).then((result: any) => {
      dispatch({
        type: 'CardQualityUpdated',
        result
      })
    })
  }

  return [checkAnswerStatus, checkAnswerResult, checkAnswer, updateCardQuality]
}

export function useCardCreate(deckId: string): [
  Async<null, RequestError, NCards.Card>,
  (card: NCards.Card) => void
] {
    const createStatus = useSelector(Select.createStatus)
  
    const dispatch = useDispatch()
    const postCard = api.request<NCards.Card>({
      method: 'POST',
      url: `decks/${deckId}/cards`,
    })
  
  const createCard = (card: NCards.Card) => {
    dispatch({
      type: "CreateCard"
    })

    postCard(card).then((result) => {
      dispatch({
        type: "CardCreated",
        result
      })
    })
  }

  return [createStatus, createCard]
}

export function useCardDetails(
  deckId: string,
  cardId: string
): [Async<null, RequestError, NCards.Card>, NCards.Card, () => void] {
  const loadStatus = useSelector(Select.loadStatus(cardId))
  const card = useSelector(Select.loadedCard(cardId))

  const dispatch = useDispatch()
  const getCard = api.request({
    method: 'GET',
    url: `decks/${deckId}/cards/${cardId}`,
  })

  const loadCard = () => {
    dispatch({
      type: 'LoadCard',
    })

    getCard().then((result: any) => {
      dispatch({
        type: 'CardLoaded',
        id: cardId,
        result,
      })
    })
  }

  return [loadStatus, card, loadCard]
}

export function useCardForm(
  deckId: string,
  cardId: string,
): [Async<null, RequestError, NCards.Card>, (card: NCards.Card) => void] {
  const updateStatus = useSelector(Select.updateStatus(cardId))

  const dispatch = useDispatch()
  const putCard = api.request<NCards.Card>({
    method: 'PUT',
    url: `decks/${deckId}/cards/${cardId}`,
  })

  const updateCard = (card: NCards.Card) => {
    dispatch({
      type: 'UpdateCard',
      id: card.id
    })

    putCard(card).then((result) => {
      dispatch({
        type: 'CardUpdated',
        id: cardId,
        result,
      })
    })
  }

  return [updateStatus, updateCard]
}

type GetNextCard = {
  type: 'GetNextCard'
}
type GetPreviousCard = {
  type: 'GetPreviousCard'
}
type UpdateUserAnswer = {
  type: 'UpdateUserAnswer'
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
    case 'GetNextCard': {
      const nextIndex = state.currentCardIndex + 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'GetPreviousCard': {
      const nextIndex = state.currentCardIndex - 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'UpdateUserAnswer': {
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
  return useReducer(cardTestFormReducer, getInitialState(cards))
}
