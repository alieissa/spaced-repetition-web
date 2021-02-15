/** @format */

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

interface Deck extends Meta {
  readonly name: string
  readonly description?: string
  readonly questions: ReadonlyArray<Question>
}
