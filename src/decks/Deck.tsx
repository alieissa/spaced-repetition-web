/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Card } from 'semantic-ui-react'
import '../App.css'
import { IconButton, Settings } from '../components'

export default function Deck() {
  const [open, setOpen] = useState(false)
  return (
    <Card>
      <Card.Header textAlign="right">
        <Settings
          id="dummyId"
          open={open}
          easiness={1}
          quality={0.5}
          interval={2}
          trigger={<IconButton name="setting" onClick={() => setOpen(true)} />}
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </Card.Header>
      <Card.Content>French</Card.Content>
    </Card>
  )
}
