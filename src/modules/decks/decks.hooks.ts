/** @format */

import _ from 'lodash'
import { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { Questions } from '../questions'
import * as Select from './decks.selectors'
import { NDecks } from './decks.types'
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

  // TODO return [status, decks]
  return { status, decks }
}

export function useCreateDeck(): [
  NDecks.State['createStatus'],
  // TODO in https://github.com/alieissa/Spaced_Repetition_Web/issues/21
  (deck: any) => void,
] {
  const dispatch = useDispatch()
  const status = useSelector(Select.createStatus)
  const postDeck = api.request({
    url: 'decks',
    method: 'POST',
  })

  // TODO Update deck type in https://github.com/alieissa/Spaced_Repetition_Web/issues/21
  const createDeck = (deck: any) => {
    dispatch({
      type: 'CreateDeck',
    })

    postDeck(deck).then((result) => {
      dispatch({
        type: 'DeckCreated',
        result,
      })
    })
  }

  return [status, createDeck]
}

export function useDeckById(
  id: NDecks.Deck['id'],
  // TODO Update deck type in
  // https://github.com/alieissa/Spaced_Repetition_Web/issues/21
): [NDecks.State['getStatus'][string], NDecks.Deck, (deck: any) => void] {
  const deck = useSelector(Select.deckById(id))
  const status = useSelector(Select.deckByIdStatus(id))
  const dispatch = useDispatch()
  const getDeck = api.request({ method: 'GET', url: `decks/${id}` })
  const putDeck = api.request({ method: 'PUT', url: `decks/${id}` })

  useEffect(() => {
    dispatch({
      type: 'GetDeck',
      id,
    })
    getDeck().then((result: any) => {
      dispatch({ type: 'DeckLoaded', result, id })
    })

    return () => {
      dispatch({ type: 'DeckReset', id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO Update deck type in
  // https://github.com/alieissa/Spaced_Repetition_Web/issues/21
  const updateDeck = (deck: any) => {
    dispatch({
      type: 'UpdateDeck',
      id: deck.id,
    })

    putDeck(deck).then((result) => {
      dispatch({
        type: 'DeckUpdated',
        id: deck.id,
        result,
      })
    })
  }

  return [status, deck, updateDeck]
}

// All Form related logic will eventually be moved
// to a component that will be used to display both
// DeckPage and NewDeck pages.
export type DeckFormState = Omit<NDecks.Initial, 'questions'> & {
  questions: _.Dictionary<Questions.Initial>
}
export type DeckFormAction =
  | {
      type: 'ADD_QUESTION'
    }
  | {
      type: 'DELETE_QUESTION'
      question: Questions.Initial
    }
  | {
      type: 'UPDATE_QUESTION'
      question: Questions.Initial
    }
  | {
      type: 'UPDATE_DECK'
      name: NDecks.Initial['name']
      description: NDecks.Initial['description']
    }
  | {
      type: 'SET_DECK'
      deck: NDecks.Deck
    }

// TODO Update deck type in 
// https://github.com/alieissa/Spaced_Repetition_Web/issues/21
const getInitState = (deck: any) => {
  return {
    ...deck,
    questions: _.keyBy(deck.questions, '__key__'),
  }
}

function reducer(state: DeckFormState, action: DeckFormAction) {
  switch (action.type) {
    case 'ADD_QUESTION': {
      const newQuestion = Questions.Initial({})
      return {
        ...state,
        questions: {
          ...state.questions,
          [newQuestion.__key__]: newQuestion,
        },
      }
    }
    case 'DELETE_QUESTION': {
      return {
        ...state,
        questions: _.omit(state.questions, action.question.__key__),
      }
    }
    case 'UPDATE_QUESTION': {
      return {
        ...state,
        questions: _.set(
          state.questions,
          action.question.__key__,
          action.question,
        ),
      }
    }
    case 'UPDATE_DECK': {
      return {
        ...state,
        name: action.name,
        description: action.description,
      }
    }

    default:
      return state
  }
}
// TODO Update deck type in 
// https://github.com/alieissa/Spaced_Repetition_Web/issues/21
export function useDeckFormReducer(deck: any = NDecks.Initial({})) {
  return useReducer(reducer, getInitState(deck))
}
