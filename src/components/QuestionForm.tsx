/** @format */
import { useFormik } from 'formik'
import * as _ from 'lodash'
import React, { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Input, List } from 'semantic-ui-react'
import { IconButton } from 'src/components'
import { styles } from 'src/styles'
import '../App.css'

type WithQuestion<T, V extends keyof Question> = T & Pick<Question, V>
interface Props {
  readonly onSubmitForm: any
  readonly onCancel: MouseEventHandler
}
function useQuestionFormik(props: WithQuestion<Props, 'content' | 'answers'>) {
  const formik = useFormik({
    initialValues: {
      // Not used in inputs but passed to component calling it to identify to which widget
      // the settings belong
      content: props.content,
      // TODO when passing in real answers group by id. Easier to manipulate
      answers: props.answers,
    },
    onSubmit: props.onSubmitForm,
  })

  const answerOperation = (
    operation: (
      answer: object,
      answers: ReadonlyArray<object>,
    ) => ReadonlyArray<object>,
  ) => {
    return (answer: object) =>
      formik.setValues((values) =>
        _.assign(values, {
          answers: operation(answer, values.answers),
        }),
      )
  }
  const removeAnswer = answerOperation((answer, values) => _.tail(values))
  const addAnswer = answerOperation((answer, values) => [
    ...values,
    { content: 'new one' },
  ])

  return { ...formik, addAnswer, removeAnswer }
}

export default function QuestionForm(
  props: WithQuestion<Props, 'content' | 'answers'>,
) {
  const formik = useQuestionFormik(props)

  return (
    <Form className="w-full">
      <List horizontal className="flex" style={styles.flex}>
        <List.Item className="flex-1">
          <Input placeholder="Enter question here" className="w-full" />
        </List.Item>
        <List.Item className="flex-1">
          <List style={styles.p0}>
            {_.map(formik.values.answers, (_, index) => (
              <List.Item key={index} className="flex" style={styles.flex}>
                <Input
                  name={`answers.$index`}
                  placeholder="Enter answer here"
                  className="w-full"
                  onChange={formik.handleChange}
                />
                <IconButton
                  circular
                  icon
                  color="white"
                  name="x"
                  size="small"
                  onClick={formik.removeAnswer}
                />
              </List.Item>
            ))}
            <List.Item style={styles.textAlignRight}>
              <IconButton
                circular
                icon
                color="white"
                iconColor="green"
                name="plus"
                size="small"
                onClick={formik.addAnswer}
              />
            </List.Item>
          </List>
        </List.Item>
      </List>

      <Form.Group className="justify-flex-end w-full">
        <Form.Button basic onClick={props.onCancel}>
          Cancel
        </Form.Button>
        <Form.Button color="green" type="submit">
          Save
        </Form.Button>
      </Form.Group>
    </Form>
  )
}
