/** @format */

import { useFormik } from 'formik'
import * as _ from 'lodash'
import React, { MouseEventHandler, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Input, List, Segment } from 'semantic-ui-react'
import { IconButton, Settings } from 'src/components'
import { styles } from 'src/styles'
import '../App.css'
import { createAnswer } from './helpers'

type WithQuestion<T, V extends keyof Question> = T & Pick<Question, V>

function useQuestionFormik(
  props: WithQuestion<EditQuestionFormProps, 'content' | 'answers'>,
) {
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

/**
 * Displays the card (question) content or edit form when user selects edit. User can
 * also delete or update settings of a card (question) in this component
 */
export default function Question() {
  const [editing, setEditing] = useState(false)
  return (
    <Segment className="justify-space-between align-center">
      {editing ? (
        // TODO refactor NewQuestion and EditQuestion into one component
        <EditQuestionForm
          content="question"
          answers={[
            createAnswer({ content: 'ansewer 1' }),
            createAnswer({ content: 'answer 2' }),
          ]}
          onSubmitForm={() => console.log('question form')}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <QuestionContent
          content="J'ai beaucoup de trucs a faire"
          onEdit={() => setEditing(true)}
          onDelete={() => console.log('on delete')}
          onSubmitSettings={() => console.log('submitSettings')}
        />
      )}
    </Segment>
  )
}

interface QuestionContentProps {
  onEdit: MouseEventHandler
  onDelete: MouseEventHandler
  onSubmitSettings: any
}
/**
 * Displays the content of the question and the delete, edit and settings buttons
 * from which user can delete, open edit form, or open settings menu
 */
function QuestionContent(props: WithQuestion<QuestionContentProps, 'content'>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <span className="ellipsis">{props.content}</span>
      <span>
        <IconButton
          icon
          circular
          name="pencil"
          color="white"
          onClick={props.onEdit}
        />
        <IconButton
          icon
          circular
          name="x"
          color="white"
          iconColor="red"
          onClick={props.onDelete}
        />
        <Settings
          id="dummyId2"
          open={open}
          easiness={1}
          quality={1}
          interval={1}
          trigger={
            <IconButton
              icon
              circular
              color="white"
              name="setting"
              onClick={() => setOpen(true)}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={props.onSubmitSettings}
        />
      </span>
    </>
  )
}

interface EditQuestionFormProps {
  readonly onSubmitForm: any
  readonly onCancel: MouseEventHandler
}
/**
 * Displays the form form which a user can change the content of the question
 * the content of the answers. User can also add an answer of if question has
 * more than answer then delete an answer
 */
function EditQuestionForm(
  props: WithQuestion<EditQuestionFormProps, 'content' | 'answers'>,
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
