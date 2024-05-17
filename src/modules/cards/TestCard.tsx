/** @format */

import { useFormik } from 'formik'
import { PropsWithChildren, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Segment } from 'semantic-ui-react'
import 'src/App.css'
import {
  SPButton,
  SPCard,
  SPCardContent,
  SPFormInput,
  SPHeader,
} from 'src/components'
import * as Yup from 'yup'
import { NDecks } from '../decks/decks.types'
import { useCard } from './cards.hooks'
import { NCards } from './cards.types'

const getQuality = (distance: number) => {
  if (distance < 0.04) {
    return 5
  }
  if (distance < 0.08) {
    return 4
  }
  if (distance < 0.12) {
    return 3
  }
  if (distance < 0.16) {
    return 2
  }
  if (distance < 0.2) {
    return 1
  }
  return 0
}
const CheckAnswerSchema = Yup.object().shape({
  answer: Yup.string().min(3).required('Required'),
})
type Props = {
  id: NCards.Card['id']
  question: NCards.Card['question']
  userAnswer: string
  deckId: NDecks.Deck['id']
  onChange: (id: NCards.Card['id'], answer: string) => void
}
export default function Card(props: PropsWithChildren<Props>) {
  const [checkAnswerStatus, checkAnswerResult, checkAnswer, updateCardQuality] =
    useCard(props.deckId, props.id)
  const form = useFormik({
    initialValues: {
      answer: props.userAnswer,
    },
    validationSchema: CheckAnswerSchema,
    onSubmit: checkAnswer,
  })

  useEffect(() => {
    form.setTouched({ answer: false })
    form.setFieldValue('answer', props.userAnswer)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userAnswer, props.id])

  useEffect(() => {
    if (checkAnswerStatus.type !== 'Success') {
      return
    }

    updateCardQuality(getQuality(checkAnswerResult.distance))
  }, [checkAnswerStatus.type, checkAnswerResult.distance, updateCardQuality])

  const answerError = form.touched.answer && !!form.errors.answer
  const getIcon = () => {
    if (
      checkAnswerStatus.type === 'Success' &&
      checkAnswerResult.distance <= 0.2
    ) {
      return 'green check'
    }

    if (
      checkAnswerStatus.type === 'Success' &&
      checkAnswerResult.distance > 0.2
    ) {
      return 'red close'
    }
  }

  return (
    <SPCard fluid data-testid={`test-card-${props.id}`}>
      <SPCardContent>
        <Segment basic>
          <SPHeader as="h3">{props.question}</SPHeader>
        </Segment>
        <Form onSubmit={form.handleSubmit}>
          <SPFormInput
            id="answer"
            title="answer"
            type="text"
            icon={getIcon()}
            color="green"
            placeholder="Enter answer here"
            error={answerError}
            value={form.values.answer}
            onChange={(e: any) => {
              props.onChange(props.id, e.target.value)
            }}
          />
          <div className="flex-row-reverse">
            <SPButton type="submit">Check</SPButton>
          </div>
        </Form>
      </SPCardContent>
      {props.children && (
        <SPCardContent className="flex-row-reverse">
          {props.children}
        </SPCardContent>
      )}
    </SPCard>
  )
}
