/** @format */

import { RootState } from 'src/types'
import { Untriggered } from 'src/utils/async'
import { NDecks } from './decks.types'

export function status(state: RootState) {
  return state.decks.status
}

export function decks(state: RootState) {
  return state.decks.decks
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
