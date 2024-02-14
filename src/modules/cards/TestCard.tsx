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
import { useCardById } from './cards.hooks'
import { NCards } from './cards.types'

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
  const [_state, _check, checkAnswer] = useCardById(props.deckId, props.id)
  const [open, setOpen] = useState(false)
  const form = useFormik({
    initialValues: {
      answer: props.userAnswer,
    },
    validationSchema: CheckAnswerSchema,
    onSubmit: checkAnswer,
  })

  useEffect(() => {
    form.setFieldValue('answer', props.userAnswer)
  }, [props.userAnswer])

  const answerError = form.touched.answer && !!form.errors.answer

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
        <SemCard.Content
          // TODO Use utility class
          style={{ display: 'flex', flexDirection: 'row-reverse' }}
        >
          {props.children}
        </SemCard.Content>
      )}
    </SemCard>
  )
}
