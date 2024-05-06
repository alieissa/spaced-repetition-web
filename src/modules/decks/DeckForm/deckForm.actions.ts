/** @format */

import { NDecks } from '../decks.types'

export type DeckFormAction =
  | {
      type: 'ADD_ANSWER'
      cardId: string
      deckId: string
    }
  | {
      type: 'DELETE_ANSWER'
      id: string
      cardId: string
      deckId: string
    }
  | {
      type: 'UPDATE_ANSWER'
      id: string
      cardId: string
      deckId: string
      content: string
    }
  | {
      type: 'ADD_CARD'
    }
  | {
      type: 'DELETE_CARD'
      id: string
    }
  | {
      type: 'UPDATE_QUESTION'
      cardId: string
      question: string
    }
  | {
      type: 'UPDATE_DECK'
      name: string
      description?: string
    }
  | {
      type: 'SET_DECK'
      deck: NDecks.Deck
    }

export const addAnswer = (dispatch: any, payload: { cardId: string }) => {
  dispatch({
    type: 'ADD_ANSWER',
    ...payload,
  })
}

export const changeDeck = (
  dispatch: any,
  payload: { name: string; description?: string },
) => {
  dispatch({
    type: 'UPDATE_DECK',
    ...payload,
  })
}

export const changeAnswer = (
  dispatch: any,
  payload: {
    id: string
    cardId: string
    content: string
  },
) => {
  dispatch({
    type: 'UPDATE_ANSWER',
    ...payload,
  })
}

export const changeQuestion = (
  dispatch: any,
  payload: { cardId: string; question: string },
) => {
  dispatch({
    type: 'UPDATE_QUESTION',
    ...payload,
  })
}

export const deleteAnswer = (
  dispatch: any,
  payload: { id: string; cardId: string },
) => {
  dispatch({
    type: 'DELETE_ANSWER',
    ...payload,
  })
}

export const addCard = (dispatch: any) => {
  dispatch({
    type: 'ADD_CARD',
  })
}
