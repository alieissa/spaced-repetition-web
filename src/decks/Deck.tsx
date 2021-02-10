/** @format */

import clsx from 'clsx'
import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Card, CardProps } from 'semantic-ui-react'
import '../App.css'
import { IconButton, Settings } from '../components'
export default function Deck(props: CardProps) {
  const [open, setOpen] = useState(false)
  return (
    <Card
      className={clsx('pointer', props.className)}
      {..._.omit(props, 'className')}
    >
      <Card.Header textAlign="right">
        <Settings
          id="dummyId"
          open={open}
          easiness={1}
          quality={0.5}
          interval={2}
          trigger={
            <IconButton
              circular
              icon
              color="white"
              name="setting"
              onClick={() => setOpen(true)}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </Card.Header>
      <Card.Content>French</Card.Content>
    </Card>
  )
}
