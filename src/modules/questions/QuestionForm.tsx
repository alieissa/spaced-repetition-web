/** @format */
import { useFormik } from 'formik'
import * as _ from 'lodash'
import React, { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Input, List } from 'semantic-ui-react'
import 'src/App.css'
import { Answers } from 'src/modules/answers'
import { styles } from 'src/styles'
import { Questions } from './questions.types'

type Props = (Questions.PostRequest | Questions.Question) & {
  readonly onSubmitForm: any
  readonly onCancel: MouseEventHandler
}

export default function QuestionForm(props: Props) {
  const formik = useFormik({
    initialValues: {
      // Not used in inputs but passed to component calling it to identify to which widget
      // the settings belong
      content: props.content,
      answers: props.answers,
    },
    onSubmit: props.onSubmitForm,
  })

  return (
    <Form className="w-full">
      <List horizontal className="flex" style={styles.flex}>
        <List.Item className="flex-1">
          <Input placeholder="Enter question here" className="w-full" />
        </List.Item>
        <List.Item className="flex-1">
          <List style={styles.p0}>
            {_.map(formik.values.answers, (answer, index) => (
              <List.Item
                key={answer.__key__}
                className="flex"
                style={styles.flex}
              >
                <Input
                  name={`answers[${index}]['content']`}
                  placeholder="Enter answer here"
                  className="w-full"
                  onChange={formik.handleChange}
                />

                <Button
                  size="small"
                  style={styles.bgWhite}
                  disabled={_.size(formik.values.answers) == 1}
                  icon={<Icon name="x" />}
                  onClick={() => {
                    const answers = _.filter(
                      formik.values.answers,
                      (a) => !_.isEqual(a, answer),
                    )
                    formik.setValues((values) => ({
                      ...values,
                      answers: answers,
                    }))
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
                  formik.setValues((values) => ({
                    ...values,
                    answers: [...values.answers, Answers.PostRequest({})],
                  }))
                }}
              />
            </List.Item>
          </List>
        </List.Item>
      </List>

      {/* <Form.Group className="justify-flex-end w-full">
        <Form.Button basic onClick={props.onCancel}>
          Cancel
        </Form.Button>
        <Form.Button color="green" type="submit">
          Save
        </Form.Button>
      </Form.Group> */}
    </Form>
  )
}
