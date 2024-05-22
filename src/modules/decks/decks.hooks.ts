/** @format */

import { Dispatch } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'
import { DecksAction } from './decks.actions'
import * as Select from './decks.selectors'
import { NDecks } from './decks.types'
export function useDecks(): [Async<null, RequestError, null>, NDecks.Deck[]] {
  const status = useSelector(Select.status)
  const decks = useSelector(Select.decks)
  const dispatch = useDispatch<Dispatch<DecksAction>>()
  const getDecks = api.request<NDecks.Deck[]>({ method: 'GET', url: 'decks' })

  useEffect(() => {
    dispatch({
      type: 'LoadDecks',
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
  return [status, decks]
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

export function useDeleteDeck(
  deckId: string,
): [Async<null, RequestError, null>, VoidFunction] {
  const dispatch = useDispatch<Dispatch<DecksAction>>()
  const deleteStatus = useSelector(Select.deleteStatus(deckId))
  const removeDeck = api.request<null>({
    method: 'DELETE',
    url: `decks/${deckId}`,
  })

  const deleteDeck = () => {
    dispatch({
      type: 'DeleteDeck',
      id: deckId,
    })

    removeDeck().then((result) => {
      dispatch({
        type: 'DeckDeleted',
        id: deckId,
        result,
      })
    })
  }
  return [deleteStatus, deleteDeck]
}
type DeckByIdReturnType = {
  status: NDecks.State['loadStatus'][string]
  deck: NDecks.Deck
  updateDeck: (deck: NDecks.Deck) => void
}
// TODO Create a useUpdateDeck hook and remove
// the update logic from this hook
export function useDeckById(
  id: NDecks.Deck['id'],
): DeckByIdReturnType {
  const deck = useSelector(Select.deck(id))
  const loadStatus = useSelector(Select.loadStatus(id))
  const dispatch = useDispatch<Dispatch<DecksAction>>()
  const getDeck = api.request<NDecks.Deck>({
    method: 'GET',
    url: `decks/${id}`,
  })
  const putDeck = api.request<NDecks.Deck>({
    method: 'PUT',
    url: `decks/${id}`,
  })
  
  useEffect(() => {
    if (loadStatus.type === 'Success') {
      return
    }

    dispatch({
      type: 'LoadDeck',
      id,
    })
    getDeck().then((result) => {
      dispatch({ type: 'DeckLoaded', result, id })
    })
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // TODO Update deck type in
  // https://github.com/alieissa/Spaced_Repetition_Web/issues/21
  const updateDeck = (deck: NDecks.Deck) => {
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

  return { status: loadStatus, deck,  updateDeck }
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
