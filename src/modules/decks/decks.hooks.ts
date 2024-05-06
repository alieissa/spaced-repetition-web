/** @format */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
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
  VoidFunction,
] {
  const dispatch = useDispatch()
  const downloadDecksStatus = useSelector(Select.downloadDecksStatus)
  const downloadDecksUrl = useSelector(Select.downloadDecksUrl)
  const download = api.request({
    method: 'GET',
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

// TODO Update deck type in
// https://github.com/alieissa/Spaced_Repetition_Web/issues/21
