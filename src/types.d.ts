/** @format */
type WithItem<T, V extends keyof I, I> = T & Pick<I, V>
interface Settings {
  readonly easiness: number
  readonly quality: number
  readonly interval: number
  readonly createdAt?: number
  readonly updatedAt?: number
}
type WithSettings<T, V extends keyof Settings = keyof Settings> = T &
  Pick<Settings, V>
interface Answer extends Settings {
  readonly content: string
}

interface Question extends Settings {
  readonly content: string
  readonly answers: ReadonlyArray<Answer>
}
type WithQuestion<T, V extends keyof Question> = WithItem<T, V, Question>

interface DeckPostRequest extends Settings {
  readonly name: string
  readonly description?: string
  readonly questions: ReadonlyArray<Question>
}
type Deck = DeckPostRequest & { id: string }
type WithDeck<T, V extends keyof Deck> = WithItem<T, V, Deck>

type RootState = {
  decks: DecksState
}
