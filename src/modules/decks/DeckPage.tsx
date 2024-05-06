/** @format */

import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Loader, Segment } from 'semantic-ui-react'
import 'src/App.css'
import { async } from 'src/utils'
import * as Select from './decks.selectors'

import { useSelector } from 'react-redux'
import { NAnswers } from '../answers'
import DeckForm from './DeckForm/DeckForm'
import { useDeckById } from './decks.hooks'

export default function Deck() {
  const params = useParams<{ deckId: string }>()
  const [status, deck, updateDeck] = useDeckById(params.deckId!)
  const updateStatus = useSelector(Select.updateStatus(params.deckId!))
  const navigate = useNavigate()
  const handleCancel = () => navigate(-1)

  return async.match(status)({
    Untriggered: () => null,
    Loading: () => (
      <Segment data-testid="deck-loading">
        <Loader active />
      </Segment>
    ),
    Success: () => {
      // __type__ is used to discriminate if an entity is from backend
      // or new.This is important when updating/inserting the entities
      const getFormedAnswer = (answer: NAnswers.Answer) => ({
        ...answer,
        __type__: 'FORMED',
      })

      const formCards = deck.cards.map((card) => ({
        ...card,
        __type__: 'FORMED',
        answers: card.answers.map(getFormedAnswer),
      }))

      const formDeck = { ...deck, cards: formCards }
      return (
        <DeckForm
          header="Update deck"
          deck={formDeck}
          successMessage="Deck successfully updated"
          failureMessage="Failed to update deck"
          submitStatus={updateStatus}
          onCancel={handleCancel}
          onSubmit={updateDeck}
        />
      )
    },
    Failure: () => {
      return <Segment data-testid="deck-failure" />
    },
  })
}
