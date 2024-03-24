/** @format */

import { useFormik } from 'formik'
import _ from 'lodash'
import { PropsWithChildren, useEffect, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Segment, Card as SemCard } from 'semantic-ui-react'
import 'src/App.css'
import { Settings } from 'src/components'
import { styles } from 'src/styles'
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
  const [open, setOpen] = useState(false)
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

  console.log('checkAnswerResult', checkAnswerResult)
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
    <SemCard fluid data-testid={`test-card-${props.id}`}>
      <SemCard.Header textAlign="right">
        <Settings
          id="dummyId2"
          open={open}
          easiness={1}
          quality={1}
          interval={1}
          trigger={
            <Button
              circular
              style={styles.bgWhite}
              icon={<Icon name="setting" onClick={() => setOpen(true)} />}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </SemCard.Header>
      <SemCard.Content>
        <Segment basic>
          <span>{props.question}</span>
        </Segment>
        <Form onSubmit={form.handleSubmit}>
          <Form.Field>
            <Form.Input
              id="answer"
              title="answer"
              type="text"
              icon={getIcon()}
              color="green"
              placeholder="Enter answer here"
              error={answerError}
              value={form.values.answer}
              onChange={(e) => {
                props.onChange(props.id, e.target.value)
              }}
            />
            <Form.Button type="submit" className="justify-flex-end">
              Check
            </Form.Button>
          </Form.Field>
        </Form>
      </SemCard.Content>
      {props.children && (
        <SemCard.Content className="flex-row-reverse">
          {props.children}
        </SemCard.Content>
      )}
    </SemCard>
  )
}
