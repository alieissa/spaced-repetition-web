/** @format */

import { uniqueId } from 'lodash'
import { MutationStatus } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from 'src/components'
import CardForm from './CardForm'
import { useCardForm } from './cards.hooks'

/**
 * This component contains the create card modal and the button that is used to toggle
 * the modal.
 */
type Props = {
  submitStatus: MutationStatus
  onSubmit: (data: any) => void
  onClose: VoidFunction
}
export default function NewCardModal(props: Props) {
  const params = useParams()
  const navigate = useNavigate()

  const initCard = {
    deckId: uniqueId(),
    question: '',
    answers: [],
  }

  const {
    form,
    getQuestionError,
    getAnswerError,
    handleAddAnswer,
    handleDeleteAnswer,
    handleChangeAnswer,
    handleChangeQuestion,
  } = useCardForm(initCard, () => {
    props.onSubmit(form.values)
  })

  const handleCloseModal = () => navigate(-1)

  return (
    <SPModal
      data-testid="card-create-modal"
      open={true}
      onClose={props.onClose}
    >
      <SPModalHeader>Create Card</SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        {props.submitStatus === 'error' && (
          <Message
            data-testid="card-create-error"
            negative
            className="w-inherit"
          >
            <Message.Header>Error: Failed to create card</Message.Header>
          </Message>
        )}

        <CardForm
          {...form.values}
          areAnswersVisible={true}
          getQuestionError={getQuestionError}
          getAnswerError={getAnswerError}
          onAddAnswer={handleAddAnswer}
          onChangeAnswer={handleChangeAnswer}
          onDeleteAnswer={handleDeleteAnswer}
          onChangeQuestion={handleChangeQuestion}
        />
      </SPModalContent>
      <SPModalActions>
        <SPButton onClick={handleCloseModal}>Cancel</SPButton>
        <SPButton
          data-testid="card-create-save-btn"
          color="green"
          onClick={form.submitForm}
        >
          Save
        </SPButton>
      </SPModalActions>
    </SPModal>
  )
}
