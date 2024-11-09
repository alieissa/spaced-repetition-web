/** @format */

import _ from 'lodash'
import { useReducer } from 'react'
import { NAnswers } from 'src/modules/answers'
import { NCards } from 'src/modules/cards'
import { Untriggered } from 'src/utils/async'
import { DeckFormAction } from './deckForm.actions'

export type FormCard = Omit<NCards.Card, 'answers'>

// All Form related logic will eventually be moved
// to a component that will be used to display both
// DeckPage and NewDeck pages.
export type DeckFormState = {
  name: string
  description?: string
  cards: FormCard[]
  answers: _.Dictionary<NAnswers.Answer[]>
}

const convertToCardsState = (cards: (NCards.Card)[]) => {
  return cards.map<FormCard>((card) => _.omit(card, 'answers'))
}

const convertToAnswersState = (cards: NCards.Card[]) => {
  return cards.reduce<Record<string, NAnswers.Answer[]>>(
    (acc, card) => ({ ...acc, [card.id]: card.answers }),
    {},
  )
}

// TODO Update deck type in
// https://github.com/alieissa/Spaced_Repetition_Web/issues/21
const getInitState = <D extends Deck>(deck: D): DeckFormState => {
  const cards = convertToCardsState(deck.cards)
  const answers = deck.cards.reduce<Record<string, NAnswers.Answer[]>>(
    (acc, card) => ({ ...acc, [card.id]: card.answers }),
    {},
  )

  return {
    ...deck,
    cards,
    answers,
    submitStatus: Untriggered()
  }
}

function reducer(state: DeckFormState, action: DeckFormAction): DeckFormState {
  switch (action.type) {
    case 'AddAnswer': {
      const newAnswer = NAnswers.Initial({})
      const updatedCardAnswers = [...state.answers[action.cardId], newAnswer]
      const updatedAnswers = {
        ...state.answers,
        [action.cardId]: updatedCardAnswers,
      }

      return { ...state, answers: updatedAnswers }
    }
    case 'UpdateAnswer': {
      const cardAnswers = state.answers[action.cardId]
      const updatedCardAnswers = cardAnswers.map((answer) =>
        answer.id === action.id
          ? { ...answer, content: action.content }
          : answer,
      )
      const updatedAnswers = {
        ...state.answers,
        [action.cardId]: updatedCardAnswers,
      }

      return { ...state, answers: updatedAnswers }
    }
    case 'DeleteAnswer': {
      const cardAnswers = state.answers[action.cardId]
      const updatedCardAnswers = cardAnswers.filter(
        (answer) => answer.id !== action.id,
      )
      const updatedAnswers = {
        ...state.answers,
        [action.cardId]: updatedCardAnswers,
      }

      return { ...state, answers: updatedAnswers }
    }

    case 'AddCard': {
      const newCard = NCards.Initial({})
      const answers = convertToAnswersState([newCard])
      const cards = convertToCardsState([newCard])

      return {
        ...state,
        answers: { ...state.answers, ...answers },
        cards: [
          ...state.cards,
          ...cards,
        ],
      }
    }
    case 'DeleteCard': {
      const updatedCards = state.cards.filter((card) => card.id !== action.id)
      const updatedAnswers = _.omit(state.answers, action.id)
      return {
        ...state,
        answers: updatedAnswers,
        cards: updatedCards,
      }
    }
    case 'UpdateQuestion': {
      const updatedCards = state.cards.map((card) =>
        card.id === action.cardId
          ? { ...card, question: action.question }
          : card,
      )

      return { ...state, cards: updatedCards }
    }

    case 'UpdateDeck': {
      return {
        ...state,
        name: action.name,
        description: action.description,
      }
    }

    case 'SetDeck': {
      return getInitState(action.deck)
    }
    default:
      return state
  }
}
// TODO Update deck type in
// https://github.com/alieissa/Spaced_Repetition_Web/issues/21
export function useDeckFormReducer<D extends Deck>(deck: D) {
  return useReducer(reducer, getInitState(deck))
}
