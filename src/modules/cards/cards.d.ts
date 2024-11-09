/** @format */
type Answer = {
  id: string
  content: string
}

type Card = {
    id?: string
    deckId: string
    question: string
    answers: Answer[]
  }
