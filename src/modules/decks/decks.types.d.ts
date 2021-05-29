/** @format */

type DecksState = {
  decks: ReadonlyArray<Deck>
  status: Async<null, Error, null>
}
