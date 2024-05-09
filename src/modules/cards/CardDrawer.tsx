/** @format */
import { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Input, List } from 'semantic-ui-react'
import 'src/App.css'
import { NAnswers } from 'src/modules/answers'
import { styles } from 'src/styles'

export type CardFormProps = {
  id: string
  question: string
  answers: NAnswers.Answer[]
  onChangeQuestion: (question: string) => void
  onChangeAnswer: (id: string, content: string) => void
  onDeleteAnswer: (id: string) => void
  onAddAnswer: VoidFunction
  onSubmitForm?: any
  onCancel?: MouseEventHandler
}

export default function CardDrawer(props: CardFormProps) {
  return (
    <Form className="w-full">
      <List horizontal className="flex" style={styles.flex}>
        <Input
          name="question-content"
          placeholder="Enter question here"
          className="w-full"
          value={props.question}
        />

        <List.Item className="flex-1">
          <List style={styles.p0}>
            {props.answers.map((answer) => (
              <List.Item key={answer.id} className="flex" style={styles.flex}>
                {answer.content}
              </List.Item>
            ))}
            <List.Item style={styles.textAlignRight}>
              <Button
                size="small"
                style={styles.bgWhite}
                icon={<Icon name="plus" color="green" />}
              />
            </List.Item>
          </List>
        </List.Item>
      </List>
    </Form>
  )
}
