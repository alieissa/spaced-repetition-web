/** @format */
import * as _ from 'lodash'
import { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Input, List } from 'semantic-ui-react'
import 'src/App.css'
import { Answers } from 'src/modules/answers'
import { styles } from 'src/styles'

export type QuestionFormProps<A extends Answers.Answer | Answers.PostRequest> =
  {
    readonly content: string
    readonly answers: ReadonlyArray<A>
    readonly onChangeContent: (content: string) => void
    readonly onChangeAnswer: (answer: A, content: string) => void
    readonly onDeleteAnswer: (answer: A) => void
    readonly onAddAnswer: VoidFunction
    readonly onSubmitForm?: any
    readonly onCancel?: MouseEventHandler
  }

export default function QuestionForm<
  A extends Answers.Answer | Answers.PostRequest,
>(props: QuestionFormProps<A>) {
  return (
    <Form className="w-full">
      <List horizontal className="flex" style={styles.flex}>
        <List.Item className="flex-1">
          <Input
            name="content"
            value={props.content}
            onChange={(e) => {
              props.onChangeContent(e.target.value)
            }}
            placeholder="Enter question here"
            className="w-full"
          />
        </List.Item>
        <List.Item className="flex-1">
          <List style={styles.p0}>
            {_.map(props.answers, (answer) => (
              <List.Item
                // key={_.get(answer, '__key__', _.get(answer, 'id'))}
                className="flex"
                style={styles.flex}
              >
                <Input
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
