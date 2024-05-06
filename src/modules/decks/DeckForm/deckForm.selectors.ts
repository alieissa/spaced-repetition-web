/** @format */

import { DeckFormState } from "./deckForm.reducer"


export const getCards = (state: DeckFormState) => {
  return state.cards
}

export const getAnswersByCardId = (state: DeckFormState, cardId: string) => {
   return state.answers[cardId]
}
