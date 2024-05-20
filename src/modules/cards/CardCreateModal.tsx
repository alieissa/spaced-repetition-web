/** @format */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader, Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from 'src/components'
import { async } from 'src/utils'
import CardForm from './CardForm'
import { useCardCreate, useCardForm } from './cards.hooks'
import { NCards } from './cards.types'

/**
 * This component contains the create card modal and the button that is used to toggle
 * the modal.
 */
export default function CardCreateModal() {
  const params = useParams()
  const navigate = useNavigate()

  const [createCardStatus, createCard] = useCardCreate(params.deckId!)

  const initCard = NCards.Initial({})

  const {
    form,
    getQuestionError,
    getAnswerError,
    handleAddAnswer,
    handleDeleteAnswer,
    handleChangeAnswer,
    handleChangeQuestion,
  } = useCardForm(initCard, () => {
    createCard(form.values)
  })

  const handleCloseModal = () => navigate(-1)

  useEffect(() => {
    if (createCardStatus.type === 'Success') {
      handleCloseModal()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCardStatus.type])

  return (
    <>
      <SPModal
        data-testid="card-create-modal"
        open={true}
        onClose={handleCloseModal}
      >
        <SPModalHeader>Create Card</SPModalHeader>
        <SPModalContent className="flex-column align-center justify-center">
          {async.match(createCardStatus)({
            Untriggered: () => null,
            Loading: () => <Loader active data-testid="card-create-loader" />,
            Success: () => null,
            Failure: () => (
              <Message
                negative
                className="w-inherit"
                data-testid="card-create-error"
              >
                <Message.Header>Card creation failed</Message.Header>
              </Message>
            ),
          })}

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
    </>
  )
}
