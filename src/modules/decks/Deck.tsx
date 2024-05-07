/** @format */

import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Card, CardProps } from 'semantic-ui-react'
import 'src/App.css'
import { NDecks } from './decks.types'

export default function Deck(props: NDecks.Deck & CardProps) {
  const navigate = useNavigate()
  return (
    <Card
      className={clsx('pointer', props.className, 'w-full')}
      style={{ border: 'none', boxShadow: 'none', width: '100%' }}
    >
      <Card.Content onClick={() => navigate(`/decks/${props.id}`)}>
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
    </Card>
  )
}
