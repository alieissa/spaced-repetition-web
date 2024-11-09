/* eslint-disable react-hooks/exhaustive-deps */

import _ from 'lodash'
import { useEffect, useState } from 'react'
import { MutationStatus } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon, Message } from 'semantic-ui-react'
import 'src/App.css'
import {
  CardForm,
  SPButton,
  SPButtonIcon,
  SPList,
  SPListItem,
  SPModal,
  SPModalActions,
  SPModalContent,
  SPSectionHeader,
  SPText,
} from 'src/components'
import { styles } from 'src/styles'
import {
  useCardDetailsQuery,
  useCardForm,
  useUpdateCardMutation,
} from './cards.hooks'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryResult = useCardDetailsQuery(params.cardId!)
  const updateCardMutation = useUpdateCardMutation()

  // TODO handle modal state in parent component
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    setIsSubmitting(false)
    navigate(`/decks/${params.deckId}`)
  }

  const handleSubmit = (card: Card) => {
    updateCardMutation.mutate(card)
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (queryResult.status !== 'success') {
      return
    }

    setIsModalOpen(true)
  }, [queryResult.status])

  useEffect(() => {
    if (updateCardMutation.status === 'success' && isSubmitting) {
      handleCloseModal()
    }
  }, [updateCardMutation.status])

  const card = queryResult.data?.data
  return (
    <SPModal
      data-testid="card-details-modal"
      open={isModalOpen}
      onClose={handleCloseModal}
    >
      {isEditing ? (
        <CardDetailsForm
          {...card}
          submitStatus={updateCardMutation.status}
          onBack={() => setIsEditing(false)}
          onCancel={handleCloseModal}
          onSubmit={handleSubmit}
        />
      ) : (
        <CardDetailsView {...card} onEdit={() => setIsEditing(true)} />
      )}
    </SPModal>
  )
}

type ViewProps = Card & { onEdit: VoidFunction }
function CardDetailsView(props: ViewProps) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  return (
    <>
      <SPSectionHeader
        data-testid="card-details-view"
        title="Card Details"
        actions={
          <SPButton data-testid="card-details-edit-btn" onClick={props.onEdit}>
            Edit
          </SPButton>
        }
      />
      <SPModalContent className="flex-column align-center justify-center">
        <div className="flex-row-reverse">
          <Icon
            data-testid="view-answers-btn"
            name={!areAnswersVisible ? 'arrow down' : 'arrow up'}
            onClick={() => setAreAnswersVisible(!areAnswersVisible)}
          />
        </div>
        <SPList horizontal className="w-full" style={styles.flex}>
          <SPListItem className="flex-1">
            <SPText className="w-full" value={props.question} />
          </SPListItem>
          <SPListItem className="flex-1">
            <SPList style={styles.p0}>
              {areAnswersVisible &&
                props.answers.map((answer, index) => {
                  return (
                    <SPListItem
                      key={answer.id}
                      data-testid={`answers-${index}`}
                    >
                      <SPText className="w-full" value={answer.content} />
                    </SPListItem>
                  )
                })}
            </SPList>
          </SPListItem>
        </SPList>
      </SPModalContent>
    </>
  )
}

type FormProps = Card & {
  submitStatus: MutationStatus
  onBack: VoidFunction
  onCancel: VoidFunction
  onSubmit: (card: Card) => void
}
function CardDetailsForm(props: FormProps) {
  const {
    form,
    getQuestionError,
    getAnswerError,
    handleAddAnswer,
    handleDeleteAnswer,
    handleChangeAnswer,
    handleChangeQuestion,
  } = useCardForm(
    _.omit(props, ['submitStatus', 'onBack', 'onCancel', 'onSubmit']),
    props.onSubmit,
  )

  return (
    <>
      <SPSectionHeader
        data-testid="card-details-form"
        title="Edit Card"
        navIcon={
          <SPButtonIcon
            data-testid="card-details-form-back-btn"
            icon="chevron left"
            size="huge"
            onClick={props.onBack}
          />
        }
      />
      {props.submitStatus === 'error' && (
        <SPModalContent className="flex-column align-center justify-center">
          <Message data-testid="card-update-error" negative>
            <Message.Header>Error: Unable to update card</Message.Header>
          </Message>
        </SPModalContent>
      )}
      <SPModalContent className="flex-column align-center justify-center">
        <CardForm
          {...form.values}
          getQuestionError={getQuestionError}
          getAnswerError={getAnswerError}
          areAnswersVisible={true}
          onChangeQuestion={handleChangeQuestion}
          onChangeAnswer={handleChangeAnswer}
          onAddAnswer={handleAddAnswer}
          onDeleteAnswer={handleDeleteAnswer}
        />
      </SPModalContent>
      <SPModalActions className="justify-flex-end">
        <SPButton
          data-testid="card-details-form-cancel-btn"
          size="small"
          onClick={props.onCancel}
        >
          Cancel
        </SPButton>
        <SPButton
          data-testid="card-details-form-save-btn"
          size="small"
          color="green"
          onClick={form.submitForm}
        >
          Save
        </SPButton>
      </SPModalActions>
    </>
  )
}
