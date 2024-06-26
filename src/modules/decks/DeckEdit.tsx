/** @format */

import { useNavigate, useParams } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Segment } from 'semantic-ui-react'
import 'src/App.css'
import * as Select from './decks.selectors'

import { useSelector } from 'react-redux'
import { SPButtonIcon, SPSectionHeader } from 'src/components'
import { async } from 'src/utils'
import { NAnswers } from '../answers'
import DeckForm from './DeckForm/DeckForm'
import { useDeckById } from './decks.hooks'

export default function DeckEdit() {
  const params = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const {
    status: loadDeckStatus,
    deck,
    updateDeck,
  } = useDeckById(params.deckId!)
  const updateStatus = useSelector(Select.updateStatus(params.deckId!))

  const handleCancel = () => navigate(-1)

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
      <main className="px-2r">
        {async.match(loadDeckStatus)({
          Untriggered: () => null,
          Loading: () => null,
          Success: () => {
            // __type__ is used to discriminate if an entity is from backend
            // or new.This is important when updating/inserting the entities
            const getFormedAnswer = (answer: NAnswers.Answer) => ({
              ...answer,
              __type__: 'FORMED',
            })

            if (loadDeckStatus.type === 'Failure') {
              return <Segment data-testid="deck-failure" />
            }

            const formCards = (deck?.cards || []).map((card) => ({
              ...card,
              __type__: 'FORMED',
              answers: (card?.answers || []).map(getFormedAnswer),
            }))

            const formDeck = { ...deck, cards: formCards }
            return (
              <DeckForm
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
        })}
      </main>
    </div>
  )
}
