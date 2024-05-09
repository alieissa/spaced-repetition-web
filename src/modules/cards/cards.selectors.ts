import { RootState } from "src/types";
import { Untriggered } from "src/utils/async";
import { NCards } from "./cards.types";

export function check(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.check[id] || { distance: 0, answer: ""}
  }
}

export function checkStatus(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.checkStatus[id] || Untriggered()
  }
}

export function createCardStatus(state: RootState) {
  return state.cards.createCardStatus
}

export function loadCardStatus(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.loadCardStatus[id] || Untriggered()
  }
}

export function loadedCardByID(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.loadedCards[id]
  }
}