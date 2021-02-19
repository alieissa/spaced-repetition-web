/** @format */

import _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card as SemCard, Form, Icon, Segment } from 'semantic-ui-react'
import { Settings } from 'src/components'
import { styles } from 'src/styles'
import '../App.css'

export default function Card() {
  const [open, setOpen] = useState(false)
  return (
    <SemCard fluid>
      <SemCard.Header textAlign="right">
        <Settings
          id="dummyId2"
          open={open}
          easiness={1}
          quality={1}
          interval={1}
          trigger={
            <Button
              circular
              style={styles.bgWhite}
              icon={<Icon name="setting" onClick={() => setOpen(true)} />}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={_.noop}
        />
      </SemCard.Header>
      <SemCard.Content>
        <Segment basic>
          <span>J'ai beaucoup de trucs a faire</span>
        </Segment>
        <Form>
          <Form.Field>
            <Form.Input type="text" placeholder="Enter answer here" />
            <Form.Button
              className="justify-flex-end"
              onClick={() => console.log('test')}
            >
              I don't know
            </Form.Button>
            <Form.Button
              className="justify-flex-end"
              onClick={() => console.log('test')}
            >
              Accept answer as correct
            </Form.Button>
          </Form.Field>
        </Form>
      </SemCard.Content>
    </SemCard>
  )
}
