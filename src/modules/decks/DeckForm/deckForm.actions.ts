/** @format */

import { Dispatch } from 'react'

export type DeckFormAction =
  | {
      type: 'AddAnswer'
      cardId: string
    }
  | {
      type: 'DeleteAnswer'
      id: string
      cardId: string
    }
  | {
      type: 'UpdateAnswer'
      id: string
      cardId: string
      content: string
    }
  | {
      type: 'AddCard'
    }
  | {
      type: 'DeleteCard'
      id: string
    }
  | {
      type: 'UpdateQuestion'
      cardId: string
      question: string
    }
  | {
      type: 'UpdateDeck'
      name: string
      description?: string
    }
  | {
      type: 'SetDeck'
      deck: Deck
    }
  | {
      type: 'ResetForm'
    }

export const addAnswer = (
  dispatch: Dispatch<DeckFormAction>,
  payload: {cardId: string },
) => {
  dispatch({
    type: 'AddAnswer',
    ...payload,
  })
}

export const changeDeck = (
  dispatch: Dispatch<DeckFormAction>,
  payload: { name: string; description?: string },
) => {
  dispatch({
    type: 'UpdateDeck',
    ...payload,
  })
}

export const changeAnswer = (
  dispatch: Dispatch<DeckFormAction>,
  payload: {
    id: string
    cardId: string
    content: string
  },
) => {
  dispatch({
    type: 'UpdateAnswer',
    ...payload,
  })
}

export const changeQuestion = (
  dispatch: Dispatch<DeckFormAction>,
  payload: { cardId: string; question: string },
) => {
  dispatch({
    type: 'UpdateQuestion',
    ...payload,
  })
}

export const deleteAnswer = (
  dispatch: Dispatch<DeckFormAction>,
  payload: { id: string; cardId: string },
) => {
  dispatch({
    type: 'DeleteAnswer',
    ...payload,
  })
}

export const addCard = (dispatch: Dispatch<DeckFormAction>) => {
  dispatch({
    type: 'AddCard',
  })
}

export const setDeck = (dispatch: Dispatch<DeckFormAction>, deck: Deck) => {
  dispatch({
    type: 'SetDeck',
    deck,
  })
}