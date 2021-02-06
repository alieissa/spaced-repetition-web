/** @format */

import React, { useCallback, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Header, Icon, Portal, Segment } from 'semantic-ui-react'
import './App.css'

// TODO clean up and move to its own component
const Settings = (props: { onClose: React.MouseEventHandler }) => {
  return (
    <Portal open onClose={props.onClose}>
      <Segment
        style={{
          left: '40%',
          position: 'fixed',
          top: '50%',
          zIndex: 1000,
        }}
      >
        <Header>This is a controlled portal</Header>
        <p>Portals have tons of great callback functions to hook into.</p>
        <p>To close, simply click the close button or click away</p>

        <Button content="Close Portal" negative onClick={props.onClose} />
      </Segment>
    </Portal>
  )
}
export default function () {
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])
  return (
    <Card>
      <Card.Header textAlign="right">
        <Icon name="setting" onClick={onOpen} />
        {open && <Settings onClose={onClose} />}
      </Card.Header>
      <Card.Content>French</Card.Content>
    </Card>
  )
}
