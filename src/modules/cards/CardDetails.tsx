/** @format */

import { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { NCards } from './cards.types'

/**
 * This component contains the card details and a button that is used to display
 * the card edit form.
 */
export default function CardDetailsModal(props: NCards.Card) {
  const [isCardDetailsEditFormOpen, setIsCardDetailsEditFormOpen] =
    useState(false)

  return (
    <>
      <Button
        data-testid="card-details-edit-btn"
        onClick={() => setIsCardDetailsEditFormOpen(true)}
      />

      {isCardDetailsEditFormOpen && <CardDetailsForm />}
      <CardDetailsView {...props} />
    </>
  )
}

function CardDetailsForm() {
  return <div data-testid="card-details-form">dummy edit form</div>
}

function CardDetailsView(props: NCards.Card) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)
  return (
    <div>
      {props.question}
      <Button
        data-testid="view-answers-btn"
        onClick={() => setAreAnswersVisible(!areAnswersVisible)}
      />
      {areAnswersVisible && (
        <div>
          {props.answers.map((answer, index) => {
            return <div data-testid={`answers-${index}`}>{answer.content}</div>
          })}
        </div>
      )}
    </div>
  )
}
