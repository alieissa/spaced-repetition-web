/** @format */

import * as _ from 'lodash'
import { useReducer } from 'react'
import 'semantic-ui-css/semantic.min.css'
import 'src/App.css'
import { CardForm } from 'src/components'
import { Answers } from 'src/modules/answers'
import { CardFormProps } from './CardForm'
import { NCards } from './cards.types'

type FormAnswer = Answers.Answer | Answers.PostRequest
type Action =
  | {
      type: 'ADD_ANSWER'
    }
  | {
      type: 'DELETE_ANSWER'
      answer: FormAnswer
    }
  | {
      type: 'UPDATE_ANSWER'
      question: string
      answer: FormAnswer
    }
  | {
      type: 'UPDATE_QUESTION_CONTENT'
      question: string
    }

type State = {
  readonly id: string
  readonly question: string
  readonly answers: ReadonlyArray<FormAnswer>
}
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DELETE_ANSWER': {
      console.log(state.answers)
      return {
        ...state,
        answers: _.filter(state.answers, (a) => {
          return !_.isEqual(a, action.answer)
        }),
      }
    }
    case 'ADD_ANSWER': {
      return {
        ...state,
        answers: _.concat(state.answers, [Answers.Initial({})]),
      }
    }
    case 'UPDATE_ANSWER': {
      return {
        ...state,
        answers: _.map(state.answers, (a) => {
          if (_.isEqual(a, action.answer)) {
            return { ...a, question: action.question }
          } else {
            return a
          }
        }),
      }
    }
    case 'UPDATE_QUESTION_CONTENT': {
      return { ...state, question: action.question }
    }
    default: {
      return state
    }
  }
}
export default function SubmittableCardForm(
  props: Required<
    Pick<CardFormProps<FormAnswer>, 'onCancel' | 'question' | 'answers'> & {
      id: string
      onSubmit: (data: State) => void
    }
  >,
) {
  const [state, dispatch] = useReducer(reducer, {
    id: props.id,
    question: props.question,
    answers: props.answers,
  })

  return (
    <CardForm<FormAnswer>
      {...state}
      onSubmitForm={() => {
        props.onSubmit(state)
      }}
      onCancel={props.onCancel}
      onDeleteAnswer={(answer) =>
        dispatch({
          type: 'DELETE_ANSWER',
          answer,
        })
      }
      onChangeQuestion={(newContent: NCards.Card['question']) => {
        dispatch({
          type: 'UPDATE_QUESTION_CONTENT',
          question: newContent,
        })
      }}
      onAddAnswer={() => {
        dispatch({ type: 'ADD_ANSWER' })
      }}
      onChangeAnswer={(answer, question) => {
        dispatch({
          type: 'UPDATE_ANSWER',
          answer,
          question,
        })
      }}
    />
  )
}
