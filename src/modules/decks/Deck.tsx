/** @format */

import clsx from 'clsx'
import * as _ from 'lodash'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, CardProps, Icon } from 'semantic-ui-react'
import 'src/App.css'
import { styles } from 'src/styles'
import { Settings } from '../../components'
interface Props {
  readonly id: string
}
export default function Deck(props: Props & CardProps) {
  const [open, setOpen] = useState(false)
  const history = useHistory()

  return (
    <Card
      className={clsx('pointer', props.className)}
      {..._.omit(props, 'className')}
    >
      <Card.Header textAlign="right">
        <Button
          style={styles.bgWhite}
          icon={<i className="fas fa-dumbbell rotate_45" />}
          onClick={() => history.push(`decks/${props.id}/exam`)}
        />

        <Settings
          id={props.id}
          open={open}
          easiness={1}
          quality={0.5}
          interval={2}
          trigger={
            <Button
              circular
              style={styles.bgWhite}
              icon={<Icon name="setting" />}
              onClick={() => setOpen(true)}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </Card.Header>
      <Card.Content onClick={() => history.push(`/decks/${props.id}`)}>
        French
      </Card.Content>
    </Card>
  )
}
