/** @format */

import { useFormik } from 'formik'
import _ from 'lodash'
import { useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as api from 'src/api'
import { RequestError } from 'src/types'
import { Async } from 'src/utils/async'
import * as Yup from 'yup'
import { NAnswers } from '../answers'
import * as Select from './cards.selectors'
import { NCards } from './cards.types'

type Params = [
  NCards.State['checkStatus'][string],
  NCards.State['check'][string],
  (answer: { answer: string }) => void,
  (quality: number) => void,
]
export function useCard(
  deckId: Deck['id'],
  id: NCards.Card['id'],
): Params {
  const dispatch = useDispatch()
  const putCard = api.request({
    method: 'PUT',
    url: `decks/${deckId}/cards/${id}`,
  })
  const postAnswerCheck = api.request({
    method: 'POST',
    url: `decks/${deckId}/cards/${id}/answers/check`,
  })

  const checkAnswerStatus = useSelector(Select.checkStatus(id))
  const checkAnswerResult = useSelector(Select.check(id))

  const checkAnswer = (answer: { answer: string }) => {
    dispatch({
      type: 'CheckAnswer',
      id,
    })

    postAnswerCheck(answer).then((result) => {
      dispatch({
        type: 'AnswerChecked',
        result,
        id,
      })
    })
  }

  const updateCardQuality = (quality: number) => {
    dispatch({
      type: 'UpdateCardQuality',
      id,
    })

    putCard({ quality }).then((result: any) => {
      dispatch({
        type: 'CardQualityUpdated',
        result,
      })
    })
  }

  return [checkAnswerStatus, checkAnswerResult, checkAnswer, updateCardQuality]
}

export function useCardCreate(
  deckId: string,
): [Async<null, RequestError, NCards.Card>, (card: NCards.Card) => void] {
  const createStatus = useSelector(Select.createStatus)

  const dispatch = useDispatch()
  const postCard = api.request<NCards.Card>({
    method: 'POST',
    url: `decks/${deckId}/cards`,
  })

  const createCard = (card: NCards.Card) => {
    dispatch({
      type: 'CreateCard',
    })

    postCard(card).then((result) => {
      dispatch({
        type: 'CardCreated',
        result,
      })
    })
  }

  return [createStatus, createCard]
}

export function useCardDetails(
  deckId: string,
  cardId: string,
): [Async<null, RequestError, NCards.Card>, NCards.Card, () => void] {
  const loadStatus = useSelector(Select.loadStatus(cardId))
  const card = useSelector(Select.loadedCard(cardId))

  const dispatch = useDispatch()
  const getCard = api.request({
    method: 'GET',
    url: `decks/${deckId}/cards/${cardId}`,
  })

  const loadCard = () => {
    dispatch({
      type: 'LoadCard',
    })

    getCard().then((result: any) => {
      dispatch({
        type: 'CardLoaded',
        id: cardId,
        result,
      })
    })
  }

  return [loadStatus, card, loadCard]
}

export function useCardUpdate(
  deckId: string,
  cardId: string,
): [Async<null, RequestError, NCards.Card>, (card: NCards.Card) => void] {
  const updateStatus = useSelector(Select.updateStatus(cardId))

  const dispatch = useDispatch()
  const putCard = api.request<NCards.Card>({
    method: 'PUT',
    url: `decks/${deckId}/cards/${cardId}`,
  })

  const updateCard = (card: NCards.Card) => {
    dispatch({
      type: 'UpdateCard',
      id: card.id,
    })

    putCard(card).then((result) => {
      dispatch({
        type: 'CardUpdated',
        id: cardId,
        result,
      })
    })
  }

  return [updateStatus, updateCard]
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
export function useCardForm(card: NCards.Card, onSubmit: (args: any) => void) {
  const form = useFormik({
    initialValues: {
      ...card
    },
    validationSchema: CardFormValidationSchema,
    onSubmit: onSubmit,
  })
  const handleAddAnswer = () => {
    const answers = [...form.values.answers, NAnswers.Initial({})]
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
  id: NCards.Card['id']
  userAnswer: string
}
type Action = GetNextCard | GetPreviousCard | UpdateUserAnswer
type State = {
  currentCardIndex: number
  cards: { id: string; question: string; userAnswer: string }[]
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
const getInitialState = (cards: ReadonlyArray<NCards.Card>) => {
  return {
    currentCardIndex: 0,
    cards: cards.map((card) => ({
      id: card.id,
      question: card.question,
      userAnswer: '',
    })),
  }
}
export function useCardTestFormReducer(cards: ReadonlyArray<NCards.Card>) {
  return useReducer(cardTestFormReducer, getInitialState(cards))
}
