/** @format */
import * as _ from 'lodash'
import { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Input, List } from 'semantic-ui-react'
import 'src/App.css'
import { Answers } from 'src/modules/answers'
import { styles } from 'src/styles'

export type CardFormProps<A extends Answers.Answer | Answers.PostRequest> = {
  readonly id: number | string
  readonly question: string
  readonly answers: ReadonlyArray<A>
  readonly onChangeQuestion: (question: string) => void
  readonly onChangeAnswer: (answer: A, question: string) => void
  readonly onDeleteAnswer: (answer: A) => void
  readonly onAddAnswer: VoidFunction
  readonly onSubmitForm?: any
  readonly onCancel?: MouseEventHandler
}

export default function CardForm<
  A extends Answers.Answer | Answers.PostRequest,
>(props: CardFormProps<A>) {
  return (
    <Form className="w-full">
      <List horizontal className="flex" style={styles.flex}>
        <List.Item className="flex-1">
          <Input
            data-testid={`question-content-${props.id}`}
            name="content"
            placeholder="Enter question here"
            className="w-full"
            value={props.question}
            onChange={(e) => {
              props.onChangeQuestion(e.target.value)
            }}
          />
        </List.Item>
        <List.Item className="flex-1">
          <List style={styles.p0}>
            {/* TODO Use type guard to detect type and get key accordingly */}
            {_.map(props.answers, (answer, index) => (
              <List.Item key={index} className="flex" style={styles.flex}>
                <Input
                  data-testid={`answer-content-${index}`}
                  value={answer.content}
                  placeholder="Enter answer here"
                  className="w-full"
                  onChange={(e) => {
                    props.onChangeAnswer(answer, e.target.value || '')
                  }}
                />

                <Button
                  size="small"
                  style={styles.bgWhite}
                  disabled={_.size(props.answers) === 1}
                  icon={<Icon name="x" />}
                  onClick={() => {
                    props.onDeleteAnswer(answer)
                  }}
                />
              </List.Item>
            ))}
            <List.Item style={styles.textAlignRight}>
              <Button
                size="small"
                style={styles.bgWhite}
                icon={<Icon name="plus" color="green" />}
                onClick={() => {
                  props.onAddAnswer()
                }}
              />
            </List.Item>
          </List>
        </List.Item>
      </List>

      <Form.Group style={styles.justifyEnd}>
        {props.onCancel && (
          <Form.Button basic size="small" onClick={props.onCancel}>
            Cancel
          </Form.Button>
        )}
        {props.onSubmitForm && (
          <Form.Button
            icon
            size="small"
            color="green"
            onClick={props.onSubmitForm}
          >
            Save
          </Form.Button>
        )}
      </Form.Group>
    </Form>
  )
}
