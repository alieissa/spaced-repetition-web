/** @format */

import { useFormik } from 'formik'
import _ from 'lodash'
import { useState } from 'react'
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
type Props = NCards.Card & {
  deckId: NDecks.Deck['id']
}
export default function Card(props: Props) {
  const [status, check, checkAnswer] = useCardById(props.deckId, props.id)
  const [open, setOpen] = useState(false)
  const form = useFormik({
    initialValues: {
      answer: '',
    },
    validationSchema: CheckAnswerSchema,
    onSubmit: checkAnswer,
  })

  const answerError = form.touched.answer && !!form.errors.answer

  return (
    <SemCard fluid>
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
              onChange={form.handleChange}
            />
            <Form.Button type="submit" className="justify-flex-end">
              Check
            </Form.Button>
          </Form.Field>
        </Form>
      </SemCard.Content>
      <SemCard.Content
        style={{ display: 'flex', flexDirection: 'row-reverse' }}
      >
        <Button icon>
          <Icon name="arrow right" />
        </Button>
        <Button icon>
          <Icon name="arrow left" />
        </Button>
      </SemCard.Content>
    </SemCard>
  )
}
