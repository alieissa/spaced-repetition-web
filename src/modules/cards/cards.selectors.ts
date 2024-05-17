import { createSelector } from "reselect";
import { RootState } from "src/types";
import { Untriggered } from "src/utils/async";
import { NCards } from "./cards.types";

const selectCheck = (state: RootState) => state.cards.check
export const check = (id: NCards.Card['id']) =>
  createSelector(
    [selectCheck],
    (check: NCards.State['check']) => check[id] || { distance: 0, answer: '' },
  )

const selectCheckStatus = (state: RootState) => state.cards.checkStatus
export const checkStatus = (id: NCards.Card['id']) =>
  createSelector(
    [selectCheckStatus],
    (checkStatus: NCards.State['checkStatus']) =>
      checkStatus[id] || Untriggered()
  )

const selectCards = (state: RootState) => state.cards
export const createStatus = createSelector([selectCards], (cards: NCards.State) => cards.createStatus)

const selectLoadStatus = (state: RootState) => state.cards.loadStatus
export const loadStatus = (id: NCards.Card['id']) =>
  createSelector(
    [selectLoadStatus],
    (loadStatus: NCards.State['loadStatus']) =>
      loadStatus[id] || Untriggered()
  )

const selectCard = (state: RootState) => state.cards.loadedCards
export const loadedCard = (id: NCards.Card['id']) =>
  createSelector(
    [selectCard],
    (loadedCards: NCards.State['loadedCards']) =>
      loadedCards[id] 
  )


const selectUpdateStatus = (state: RootState) => state.cards.updateStatus
export const updateStatus = (id: NCards.Card['id']) =>
  createSelector(
    [selectUpdateStatus],
    (updateStatus: NCards.State['updateStatus']) => updateStatus[id] || Untriggered(),
  )
