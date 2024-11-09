/** @format */

import { useFormik } from 'formik'
import _, { omit } from 'lodash'
import { useReducer } from 'react'
import { useMutation, useQuery } from 'react-query'
import useAppContext from 'src/app.hooks'
import * as Yup from 'yup'

export function useCheckAnswerMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api_.post(`cards/${data.id}/check-answer`, omit(data, 'id')),
  })

  return mutation
  
}

export function useCreateCardMutation() {
  const { api: api_ } = useAppContext();
  
  const mutation = useMutation({ mutationFn: (data: Card) => api_.post('cards', data) })
  return mutation
}

export function useCardDetailsQuery(cardId: string) {
  const { api: api_ } = useAppContext()

  const result = useQuery({ queryKey: ['card', cardId], queryFn: () => api_.get(`cards/${cardId}`) })
  return result
}

export function useUpdateCardMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (data: any) => api_.patch(`cards/${data.id}`, omit(data, 'id')),
  })
  return mutation
}

const CardFormValidationSchema = Yup.object().shape({
  question: Yup.string().min(3).required('Required'),
  answers: Yup.array(
    Yup.object().shape({
      content: Yup.string().min(3).required('Required'),
    }),
  )
    .min(1)
    .required('Required'),
})
export function useCardForm(card: Card, onSubmit: (args: any) => void) {
  const form = useFormik({
    initialValues: {
      ...card
    },
    validationSchema: CardFormValidationSchema,
    onSubmit: onSubmit,
  })
  const handleAddAnswer = () => {
    const answers = [...form.values.answers, {content: ''}]
    form.setFieldValue('answers', answers)
  }

  const handleDeleteAnswer = (id: string) => {
    const answers = form.values.answers.filter((answer) => answer.id !== id)
    form.setFieldValue('answers', answers)
  }

  const handleChangeAnswer = (id: string, newAnswerContent: string) => {
    const answers = form.values.answers.map((answer) =>
      answer.id === id ? { ...answer, content: newAnswerContent } : answer,
    )
    form.setFieldValue('answers', answers)
  }

  const handleChangeQuestion = (question: string) => {
    form.setFieldValue('question', question)
  }

  const getAnswerError = (index: number) => {
    const answerErrors = form.errors.answers || []
    const touched = !_.isEmpty(form.touched)
    return !!answerErrors[index] && touched
  }

  const getQuestionError = () => {
    const questionError = form.errors.question
    const touched = !_.isEmpty(form.touched)
    return !!(questionError && touched)
  }

  return {
    form,
    handleAddAnswer,
    handleDeleteAnswer,
    handleChangeAnswer,
    handleChangeQuestion,
    getAnswerError,
    getQuestionError,
  }
}

type GetNextCard = {
  type: 'GetNextCard'
}
type GetPreviousCard = {
  type: 'GetPreviousCard'
}
type UpdateUserAnswer = {
  type: 'UpdateUserAnswer'
  id: string
  userAnswer: string
}
type Action = GetNextCard | GetPreviousCard | UpdateUserAnswer
type State = {
  currentCardIndex: number
  cards: { id?: string; question: string; userAnswer: string }[]
}
function cardTestFormReducer(state: State, action: Action) {
  switch (action.type) {
    case 'GetNextCard': {
      const nextIndex = state.currentCardIndex + 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'GetPreviousCard': {
      const nextIndex = state.currentCardIndex - 1
      return { ...state, currentCardIndex: nextIndex }
    }
    case 'UpdateUserAnswer': {
      const updatedCard = {
        ...state.cards[state.currentCardIndex],
        userAnswer: action.userAnswer,
      }
      const updatedCards = state.cards.map((card, index) =>
        index === state.currentCardIndex ? updatedCard : card,
      )

      return {
        ...state,
        cards: updatedCards,
      }
    }
  }
}
const getInitialState = (cards: ReadonlyArray<Card>) => {
  return {
    currentCardIndex: 0,
    cards: cards.map((card) => ({
      id: card.id,
      question: card.question,
      userAnswer: '',
    })),
  }
}
export function useCardTestFormReducer(cards: ReadonlyArray<Card>) {
  return useReducer(cardTestFormReducer, getInitialState(cards))
}
