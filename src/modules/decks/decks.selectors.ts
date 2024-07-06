/** @format */

import _ from 'lodash'
import { createSelector } from 'reselect'
import { RootState } from 'src/types'
import { Untriggered } from 'src/utils/async'
import { NDecks } from './decks.types'
const selectDecks = (state: RootState) => state.decks

export const decks = createSelector([selectDecks], (decks: NDecks.State) =>
  _.values(decks.decks),
)

export function status(state: RootState) {
  return state.decks.status
}

export function createStatus(state: RootState) {
  return state.decks.createStatus
}

const selectDeck = (state: RootState) => state.decks.decks
export const deck = (id: NDecks.Deck['id']) =>
  createSelector([selectDeck], (decks: NDecks.State['decks']) => decks[id])

const selectLoadStatus = (state: RootState) => state.decks.loadStatus
export const loadStatus = (id: NDecks.Deck['id']) =>
  createSelector(
    [selectLoadStatus],
    (loadStatus: NDecks.State['loadStatus']) => loadStatus[id] || Untriggered(),
  )

const selectUpdateStatus = (state: RootState) => state.decks.updateStatus
export const updateStatus = (id: NDecks.Deck['id']) =>
  createSelector(
    [selectUpdateStatus],
    (updateStatus: NDecks.State['updateStatus']) =>
      updateStatus[id] || Untriggered(),
  )

const selectDeleteStatus = (state: RootState) => state.decks.deleteStatus
export const deleteStatus = (id: NDecks.Deck['id']) =>
  createSelector(
    [selectDeleteStatus],
    (deleteStatus: NDecks.State['deleteStatus']) =>
      deleteStatus[id] || Untriggered(),
  )

export const uploadDecksStatus = createSelector(
  [selectDecks],
  (decks) => decks.uploadDecksStatus,
)

export const downloadDecksStatus = createSelector(
  [selectDecks],
  (decks) => decks.downloadDecksStatus,
)

export const downloadDecksUrl = createSelector(
  [selectDecks],
  (decks) => decks.downloadDecksUrl,
)
