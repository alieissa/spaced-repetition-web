/** @format */

import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, CardProps } from 'semantic-ui-react'
import 'src/App.css'
import { styles } from 'src/styles'
import { NDecks } from './decks.types'

export default function Deck(props: NDecks.Deck & CardProps) {
  const navigate = useNavigate()
  return (
    <Card className={clsx('pointer', props.className)}>
      <Card.Header textAlign="right">
        <Button
          style={styles.bgWhite}
          icon={<i className="fas fa-dumbbell rotate_45" />}
          onClick={() => navigate(`/decks/${props.id}/exam`)}
        />
      </Card.Header>
      <Card.Content onClick={() => navigate(`/decks/${props.id}`)}>
        {props.name}
      </Card.Content>
    </Card>
  )
}
