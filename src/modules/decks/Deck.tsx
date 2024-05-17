/** @format */

import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Card, CardProps } from 'semantic-ui-react'
import 'src/App.css'
import { SPCard, SPCardContent, SPCardHeader } from 'src/components'
import { NDecks } from './decks.types'

const styles = {
  width: '100%',
}
export default function Deck(props: NDecks.Deck & CardProps) {
  const navigate = useNavigate()
  return (
    <SPCard className={clsx('pointer', props.className)} style={styles}>
      <SPCardContent onClick={() => navigate(`/decks/${props.id}`)}>
        <SPCardHeader size="big">{props.name}</SPCardHeader>
        <Card.Description>{props.description}</Card.Description>
      </SPCardContent>
    </SPCard>
  )
}
