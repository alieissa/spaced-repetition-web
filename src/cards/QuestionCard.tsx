/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Card as SemCard, CardProps } from 'semantic-ui-react'
import '../App.css'
import { IconButton, Settings } from '../components'

export default function Card(props: CardProps) {
  const [open, setOpen] = useState(false)
  return (
    <SemCard {...props}>
      <SemCard.Header textAlign="right">
        <Settings
          id="dummyId2"
          open={open}
          easiness={1}
          quality={1}
          interval={1}
          trigger={
            <IconButton
              icon
              circular
              color="white"
              name="setting"
              onClick={() => setOpen(true)}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </SemCard.Header>
      <SemCard.Content>
        <span className="ellipsis">J'ai beaucoup de trucs a faire</span>
      </SemCard.Content>
    </SemCard>
  )
}
