/** @format */

import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Segment } from 'semantic-ui-react'
import 'src/App.css'

import { SPButtonIcon, SPSectionHeader } from 'src/components'
import DeckForm from './DeckForm/DeckForm'
import { useDeckByIdQuery, useUpdateDeckMutation } from './decks.hooks'

export default function DeckEdit() {
  const params = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const updateDeckMutation = useUpdateDeckMutation()
  const deckQueryResult = useDeckByIdQuery(params.deckId!)

  const handleCancel = () => navigate(-1)

  const renderDeckForm = () => {
    switch (deckQueryResult.status) {
      case 'idle':
      case 'loading':
        return null
      case 'success':
        const deck = deckQueryResult.data.data
        // __type__ is used to discriminate if an entity is from backend
        // or new.This is important when updating/inserting the entities
        const getFormedAnswer = (answer: Answer) => ({
          ...answer,
        })

        const formCards = (deck?.cards || []).map((card) => ({
          ...card,
          answers: (card?.answers || []).map(getFormedAnswer),
        }))

        const formDeck = { ...deck, cards: formCards }
        return (
          <DeckForm
            deck={formDeck}
            successMessage="Deck successfully updated"
            failureMessage="Failed to update deck"
            submitStatus={updateDeckMutation.status}
            onCancel={handleCancel}
            onSubmit={updateDeckMutation.mutate}
          />
        )
      case 'error':
        return <Segment data-testid="deck-failure" />
    }
  }

  return (
    <div data-testid="deck-success">
      <SPSectionHeader
        title="Edit Deck"
        navIcon={
          <SPButtonIcon
            size="huge"
            icon="chevron left"
            onClick={handleCancel}
          />
        }
        style={{ borderBottom: '1px solid' }}
      />
      <main className="px-2r">{renderDeckForm()}</main>
    </div>
  )
}
