/** @format */

import { useFormik } from 'formik'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Icon, List, ListItem } from 'semantic-ui-react'
import 'src/App.css'
import {
  SPButton,
  SPModal,
  SPModalContent,
  SPModalHeader,
  SPText,
} from 'src/components'
import { styles } from 'src/styles'
import * as Yup from 'yup'
import { NAnswers } from '../answers'
import { useCardDetails } from './cards.hooks'
import { NCards } from './cards.types'

/**
 * This component contains the card details modal. The modal displays the
 * details of a card and an edit form when user clicks on edit.
 *
 * The modal is not controlled by any parent component, it is displayed when
 * the route /decks/:deckId/cards/:cardId is hit and it controls its state
 * completely
 */
export default function CardDetailsModal() {
  const params = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loadCardStatus, card, loadCard] = useCardDetails(
    params.deckId!,
    params.cardId!,
  )

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    navigate(`/decks/${params.deckId}`)
  }

  useEffect(() => {
    loadCard()
  }, [params.cardId])

  useEffect(() => {
    if (loadCardStatus.type !== 'Success') {
      return
    }

    setIsModalOpen(true)
  }, [loadCardStatus.type])

  return (
    <SPModal
      data-testid="card-details-modal"
      open={isModalOpen}
      onClose={handleCloseModal}
    >
      {isEditing ? (
        <CardDetailsForm
          {...card}
          onBack={() => setIsEditing(false)}
          onSubmit={() => console.log('test')}
        />
      ) : (
        <CardDetailsView {...card} onEdit={() => setIsEditing(true)} />
      )}
    </SPModal>
  )
}

type ViewProps = NCards.Card & { onEdit: VoidFunction }
function CardDetailsView(props: ViewProps) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  return (
    <>
      <SPModalHeader data-testid="card-details-view">
        <div className="justify-space-between">
          <span>Card Details</span>
          <SPButton data-testid="card-details-edit-btn" onClick={props.onEdit}>
            Edit
          </SPButton>
        </div>
      </SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        <div className="flex-row-reverse">
          <Icon
            data-testid="view-answers-btn"
            name={!areAnswersVisible ? 'arrow down' : 'arrow up'}
            onClick={() => setAreAnswersVisible(!areAnswersVisible)}
          />
        </div>
        <List horizontal className="w-full" style={styles.flex}>
          <ListItem className="flex-1">
            <SPText className="w-full" value={props.question} />
          </ListItem>
          <ListItem className="flex-1">
            <List style={styles.p0}>
              {areAnswersVisible &&
                props.answers.map((answer, index) => {
                  return (
                    <ListItem key={answer.id} data-testid={`answers-${index}`}>
                      <SPText className="w-full" value={answer.content} />
                    </ListItem>
                  )
                })}
            </List>
          </ListItem>
        </List>
      </SPModalContent>
    </>
  )
}

const CardFormValidationSchema = Yup.object().shape({
  question: Yup.string().min(3).required('Required'),
  answers: Yup.array(
    Yup.object().shape({
      content: Yup.string().min(3).required('Required'),
    }),
  )
    .min(1)
    .required('Required'),
})
type FormProps = NCards.Card & { onBack: VoidFunction; onSubmit: VoidFunction }
function CardDetailsForm(props: FormProps) {
  const handleSubmit = (values: any) => {
    return
  }

  const form = useFormik({
    initialValues: {
      question: props.question,
      answers: props.answers,
    },
    validationSchema: CardFormValidationSchema,
    onSubmit: handleSubmit,
  })

  const handleAddAnswer = () => {
    const answers = [...form.values.answers, NAnswers.Initial({})]
    form.setFieldValue('answers', answers)
  }

  const handleDeleteAnswer = (id: string) => {
    const answers = form.values.answers.filter((answer) => answer.id !== id)
    form.setFieldValue('answers', answers)
  }

  const handleChangeAnswer = (id: string, newAnswerContent: string) => {
    const answers = form.values.answers.map((answer) =>
      answer.id === id ? { ...answer, content: newAnswerContent } : answer,
    )
    form.setFieldValue('answers', answers)
  }

  const handleChangeQuestion = (question: string) => {
    form.setFieldValue('question', question)
  }

  const getAnswerError = (index: number) => {
    const answerErrors = form.errors.answers || []
    const touched = !_.isEmpty(form.touched)
    return !!answerErrors[index] && touched
  }

  const getQuestionError = () => {
    const questionError = form.errors.question
    const touched = !_.isEmpty(form.touched)
    return questionError && touched
  }

  return (
    <>
      <SPModalHeader data-testid="card-details-form">
        <div>Edit Card</div>
        <SPButton
          data-testid="card-details-form-back-btn"
          onClick={props.onBack}
        />
      </SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        <Form className="w-full">
          <List horizontal className="flex" style={styles.flex}>
            <List.Item className="flex-1">
              <Form.Input
                name="question-content"
                placeholder="Enter question here"
                className="w-full"
                error={getQuestionError()}
                value={form.values.question}
                onChange={(e) => {
                  handleChangeQuestion(e.target.value)
                }}
              />
            </List.Item>
            <List.Item className="flex-1">
              <List style={styles.p0}>
                {form.values.answers.map((answer, index) => (
                  <List.Item
                    key={answer.id}
                    className="flex"
                    style={styles.flex}
                  >
                    <Form.Input
                      value={answer.content}
                      placeholder="Enter answer here"
                      className="w-full"
                      error={getAnswerError(index)}
                      name="answer-content"
                      onChange={(e) =>
                        handleChangeAnswer(answer.id, e.target.value)
                      }
                    />

                    <SPButton
                      size="small"
                      style={styles.bgWhite}
                      disabled={form.values.answers.length === 1}
                      icon={<Icon name="x" />}
                      onClick={() => handleDeleteAnswer(answer.id)}
                    />
                  </List.Item>
                ))}
                <List.Item style={styles.textAlignRight}>
                  <SPButton
                    size="small"
                    style={styles.bgWhite}
                    icon={<Icon name="plus" color="green" />}
                    onClick={handleAddAnswer}
                  />
                </List.Item>
              </List>
            </List.Item>
          </List>

          <div className="flex-row-reverse">
            <SPButton
              data-testid="card-details-form-save-btn"
              size="small"
              color="green"
              type="submit"
              onClick={form.submitForm}
            >
              Save
            </SPButton>
          </div>
        </Form>
      </SPModalContent>
    </>
  )
}
