/** @format */

import _ from 'lodash'
import { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { NCards } from '../cards'
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

export function useUploadDecks(): [
  NDecks.State['uploadDecksStatus'],
  (file: File) => void,
  VoidFunction,
] {
  const dispatch = useDispatch()
  const uploadDecksStatus = useSelector(Select.uploadDecksStatus)

  const resetUploadDecks = () => {
    dispatch({
      type: 'ResetUploadDecks',
    })
  }
  const upload = api.upload({
    url: 'decks/upload',
  })
  const uploadDecks = (file: File) => {
    const formdata = new FormData()
    formdata.append('filename', file, file.name)

    dispatch({
      type: 'UploadDecks',
    })

    upload(formdata).then((result) => {
      dispatch({
        type: 'DecksUploaded',
        result,
      })
    })
  }
  return [uploadDecksStatus, uploadDecks, resetUploadDecks]
}

export function useDownloadDecks(): [
  NDecks.State['downloadDecksUrl'],
  NDecks.State['downloadDecksStatus'],
  VoidFunction
] {
  const dispatch = useDispatch()
  const downloadDecksStatus = useSelector(Select.downloadDecksStatus)
  const downloadDecksUrl = useSelector(Select.downloadDecksUrl)
  const download = api.request({
    method: "GET",
    url: 'decks/download',
  })
  const downloadDecks = () => {
    dispatch({
      type: 'DownloadDecks',
    })

    download().then((result) => {
      dispatch({
        type: 'DecksDownloaded',
        result,
      })
    })
  }
  
  return [downloadDecksUrl, downloadDecksStatus, downloadDecks]
}

// All Form related logic will eventually be moved
// to a component that will be used to display both
// DeckPage and NewDeck pages.
export type DeckFormState = Omit<NDecks.Initial, 'cards'> & {
  cards: _.Dictionary<NCards.Initial>
}
export type DeckFormAction =
  | {
      type: 'ADD_CARD'
    }
  | {
      type: 'DELETE_CARD'
      card: NCards.Initial
    }
  | {
      type: 'UPDATE_CARD'
      card: NCards.Initial
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
    case 'ADD_CARD': {
      const newCard = NCards.Initial({})
      return {
        ...state,
        cards: {
          ...state.cards,
          [newCard.__key__]: newCard,
        },
      }
    }
    case 'DELETE_CARD': {
      return {
        ...state,
        cards: _.omit(state.cards, action.card.__key__),
      }
    }
    case 'UPDATE_CARD': {
      return {
        ...state,
        cards: _.set(
          state.cards,
          action.card.__key__,
          action.card,
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
