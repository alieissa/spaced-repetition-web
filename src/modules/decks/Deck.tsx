/** @format */

import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, CardProps } from 'semantic-ui-react'
import 'src/App.css'
import { styles } from 'src/styles'
import { Decks } from './decks.types'
interface Props {
  readonly id: string
}
export default function Deck(props: Decks.Deck & CardProps) {
  const history = useHistory()
  return (
    <Card className={clsx('pointer', props.className)}>
      <Card.Header textAlign="right">
        <Button
          style={styles.bgWhite}
          icon={<i className="fas fa-dumbbell rotate_45" />}
          onClick={() => history.push(`decks/${props.id}/exam`)}
        />
      </Card.Header>
      <Card.Content onClick={() => history.push(`/decks/${props.id}`)}>
        {props.name}
      </Card.Content>
    </Card>
  )
}
