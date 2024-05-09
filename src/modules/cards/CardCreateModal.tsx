/** @format */

import { useEffect, useState } from 'react'
import { Loader, Message } from 'semantic-ui-react'
import {
  SPButton,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPModalHeader,
} from 'src/components'
import { async } from 'src/utils'
import { NAnswers } from '../answers'
import CardForm from './CardForm'
import { useCardCreate } from './cards.hooks'
import { NCards } from './cards.types'

type Props = {
  deckId: string
}
/**
 * This component contains the create card modal and the button that is used to toggle
 * the modal.
 */
export default function CardCreateModal(props: Props) {
  const [card, setCard] = useState(NCards.Initial({ deckId: props.deckId }))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [createCardStatus, createCard] = useCardCreate(props.deckId)

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleChangeQuestion = (question: string) => {
    setCard({ ...card, question })
  }

  const handleChangeAnswer = (answerId: string, content: string) => {
    setCard({
      ...card,
      answers: card.answers.map((answer) =>
        answer.id === answerId ? { ...answer, content } : answer,
      ),
    })
  }

  const handleAddAnswer = () => {
    setCard({ ...card, answers: [...card.answers, NAnswers.Initial({})] })
  }

  const handleDeleteAnswer = (answerId: string) => {
    setCard({
      ...card,
      answers: card.answers.filter((answer) => answer.id !== answerId),
    })
  }

  const handleCardCreate = () => {
    createCard(card)
  }

  useEffect(() => {
    if (createCardStatus.type === 'Success') {
      handleCloseModal()
    }
  }, [createCardStatus.type])

  return (
    <>
      <SPButton
        data-testid="card-create-modal-btn"
        color="green"
        icon="plus"
        onClick={() => setIsModalOpen(true)}
      />
      <SPModal
        data-testid="card-create-modal"
        open={isModalOpen}
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
            {...card}
            onChangeQuestion={handleChangeQuestion}
            onChangeAnswer={handleChangeAnswer}
            onAddAnswer={handleAddAnswer}
            onDeleteAnswer={handleDeleteAnswer}
          />
        </SPModalContent>
        <SPModalActions>
          <SPButton onClick={handleCloseModal}>Cancel</SPButton>
          <SPButton
            data-testid="card-create-save-btn"
            color="green"
            onClick={handleCardCreate}
          >
            Save
          </SPButton>
        </SPModalActions>
      </SPModal>
    </>
  )
}
