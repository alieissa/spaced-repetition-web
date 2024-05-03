/** @format */

import { RootState } from 'src/types'
import { Untriggered } from 'src/utils/async'
import { NDecks } from './decks.types'

export function decks(state: RootState) {
  return state.decks.decks
}

export function status(state: RootState) {
  return state.decks.status
}

export function createStatus(state: RootState) {
  return state.decks.createStatus
}

export function getStatus(state: RootState) {
  return state.decks.getStatus
}


export function deckById(id: NDecks.Deck['id']) {
  return (state: RootState) => {
    return decks(state)[id]
  }
}

export function deckByIdStatus(id: NDecks.Deck['id']) {
  return (state: RootState) => {
    return state.decks.getStatus[id] || Untriggered()
  }
}

export function updateStatus(id: NDecks.Deck['id']) {
  return (state: RootState) => {
    return state.decks.updateStatus[id] ?? Untriggered()
  }
}

export function uploadDecksStatus(state: RootState) {
  return state.decks.uploadDecksStatus
}

export function downloadDecksUrl(state: RootState) {
  return state.decks.downloadDecksUrl
}

export function downloadDecksStatus(state: RootState) {
  return state.decks.downloadDecksStatus
}
