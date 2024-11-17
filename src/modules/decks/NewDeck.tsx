/** @format */

import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import 'src/App.css'
import { SPButtonIcon, SPSectionHeader } from 'src/components'
import DeckForm from './DeckForm/DeckForm'

import { useCreateDeckMutation } from './decks.hooks'

export default function NewDeck() {
  const navigate = useNavigate()
  const createMutation = useCreateDeckMutation()

  const handleCancel = () => {
    navigate(-1)
  }
  const handleSubmit = (deck: Deck) => {
    createMutation.mutate({
      description: deck.description,
      name: deck.name,
      cards: deck.cards,
    })
  }
  return (
    <div data-testid="deck-success" className="bordered">
      <SPSectionHeader
        title="Create Deck"
        navIcon={
          <SPButtonIcon
            size="huge"
            icon="chevron left"
            onClick={handleCancel}
          />
        }
        className="bordered"
      />
      <main className="px-2r">
        <DeckForm
          deck={{ name: '', cards: [] }}
          submitStatus={createMutation.status}
          successMessage="Deck successfully created"
          failureMessage="Failed to create deck"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  )
}
