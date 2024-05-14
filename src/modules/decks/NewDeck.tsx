/** @format */

import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import 'src/App.css'
import DeckForm from './DeckForm/DeckForm'
import { useCreateDeck } from './decks.hooks'
import { NDecks } from './decks.types'

export default function NewDeck() {
  const navigate = useNavigate()
  const [createDeckStatus, createDeck] = useCreateDeck()

  const handleCancel = () => {
    navigate(-1)
  }
  const handleSubmit = (deck: NDecks.Deck | NDecks.Initial) => {
    createDeck({
      description: deck.description,
      name: deck.name,
      cards: deck.cards,
    })
  }
  return (
    <DeckForm
      header="Create deck"
      deck={NDecks.Initial({})}
      submitStatus={createDeckStatus}
      successMessage="Deck successfully created"
      failureMessage="Failed to create deck"
      onSubmit={handleSubmit}
    />
  )
}
