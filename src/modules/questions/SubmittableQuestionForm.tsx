/** @format */

import * as _ from 'lodash'
import { useReducer } from 'react'
import 'semantic-ui-css/semantic.min.css'
import 'src/App.css'
import { QuestionForm } from 'src/components'
import { Answers } from 'src/modules/answers'
import { Questions } from '.'
import { QuestionFormProps } from './QuestionForm'

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
      answer: FormAnswer
      content: string
    }
  | {
      type: 'UPDATE_QUESTION_CONTENT'
      content: string
    }

type State = {
  readonly id: string
  readonly content: string
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
            return { ...a, content: action.content }
          } else {
            return a
          }
        }),
      }
    }
    case 'UPDATE_QUESTION_CONTENT': {
      return { ...state, content: action.content }
    }
    default: {
      return state
    }
  }
}
export default function SubmittableQuestionForm(
  props: Required<
    Pick<QuestionFormProps<FormAnswer>, 'onCancel' | 'content' | 'answers'> & {
      id: string
      onSubmit: (data: State) => void
    }
  >,
) {
  const [state, dispatch] = useReducer(reducer, {
    id: props.id,
    content: props.content,
    answers: props.answers,
  })

  return (
    <QuestionForm<FormAnswer>
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
      onChangeContent={(newContent: Questions.Question['content']) => {
        dispatch({
          type: 'UPDATE_QUESTION_CONTENT',
          content: newContent,
        })
      }}
      onAddAnswer={() => {
        dispatch({ type: 'ADD_ANSWER' })
      }}
      onChangeAnswer={(answer, content) => {
        dispatch({
          type: 'UPDATE_ANSWER',
          answer,
          content,
        })
      }}
    />
  )
}
