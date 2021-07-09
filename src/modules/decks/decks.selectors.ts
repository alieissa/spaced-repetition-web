/** @format */

import { RootState } from 'src/types'
import { Untriggered } from 'src/utils/async'
import { Decks } from './decks.types'

export function status(state: RootState) {
  return state.decks.status
}

export function decks(state: RootState) {
  return state.decks.decks
}

export function deckById(id: Decks.Deck['id']) {
  return (state: RootState) => {
    return decks(state)[id]
  }
}

export function deckByIdStatus(id: Decks.Deck['id']) {
  return (state: RootState) => {
    return state.decks.getStatus[id] || Untriggered()
  }
}
