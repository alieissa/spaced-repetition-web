import { RootState } from "src/types";
import { Untriggered } from "src/utils/async";
import { NCards } from "./cards.types";

export function check(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.check[id]
  }
}

export function checkStatus(id: NCards.Card['id']) {
  return (state: RootState) => {
    return state.cards.checkStatus[id] || Untriggered()
  }
}