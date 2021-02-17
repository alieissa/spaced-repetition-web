/** @format */
type WithItem<T, V extends keyof I, I> = T & Pick<I, V>
interface Meta {
  readonly easiness: number
  readonly quality: number
  readonly interval: number
  readonly createdAt: number
  readonly updatedAt: number
}

interface Answer extends Meta {
  readonly content: string
}

interface Question extends Meta {
  readonly content: string
  readonly answers: ReadonlyArray<Answer>
}
type WithQuestion<T, V extends keyof Question> = WithItem<T, V, Question>

interface DeckPostRequest extends Meta {
  readonly name: string
  readonly description?: string
  readonly questions: ReadonlyArray<Question>
}
type Deck = DeckPostRequest & { id: string }
type WithDeck<T, V extends keyof Deck> = WithItem<T, V, Deck>
