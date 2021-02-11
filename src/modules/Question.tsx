/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
// import { CardProps, Segment } from 'semantic-ui-react'
import { Segment } from 'semantic-ui-react'
import { IconButton, Settings } from 'src/components'
import '../App.css'

export default function Question() {
  const [open, setOpen] = useState(false)
  return (
    <Segment className="justify-space-between align-center">
      <span className="ellipsis">J'ai beaucoup de trucs a faire</span>
      <span>
        <IconButton icon circular name="pencil" color="white" />
        <IconButton icon circular name="x" color="white" iconColor="red" />
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
      </span>
    </Segment>
  )
}
