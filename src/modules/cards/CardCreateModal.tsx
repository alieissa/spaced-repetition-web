/** @format */

import { uniqueId } from 'lodash'
import { useEffect } from 'react'
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
import { useCardForm, useCreateCardMutation } from './cards.hooks'

/**
 * This component contains the create card modal and the button that is used to toggle
 * the modal.
 */
//TODO Move close/open logic to parent component
export default function CardCreateModal() {
  const params = useParams()
  const navigate = useNavigate()
  const createCardMutation = useCreateCardMutation()

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
    createCardMutation.mutate(form.values)
  })

  const handleCloseModal = () => navigate(-1)

  useEffect(() => {
    if (createCardMutation.status === 'success') {
      handleCloseModal()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCardMutation.status])

  return (
    <SPModal
      data-testid="card-create-modal"
      open={true}
      onClose={handleCloseModal}
    >
      <SPModalHeader>Create Card</SPModalHeader>
      <SPModalContent className="flex-column align-center justify-center">
        {createCardMutation.status === 'error' && (
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
