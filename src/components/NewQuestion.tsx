/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Card, Input, List } from 'semantic-ui-react'
import { IconButton } from 'src/components'
// import { IconButton, Settings } from 'src/components'
import '../App.css'
import { styles } from '../styles'

export default function NewQuestion() {
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState(1)
  if (answers === 0) {
    return null
  }
  return (
    <Card fluid className="flex-1">
      <Card.Header textAlign="right">
        {/* </SemCard.Content> */}
        {/* <SemCard.Content> */}
        <span>
          <IconButton icon circular name="pencil" color="white" />
          <IconButton icon circular name="x" color="white" iconColor="red" />
          <IconButton icon circular name="setting" color="white" />
        </span>
        {/* <IconButton
          circular
          icon
          color="white"
          name="x"
          onClick={() => setAnswers(0)}
        />
        <Settings
          id="dummyId4"
          open={open}
          easiness={1}
          quality={2}
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
        /> */}
      </Card.Header>
      <Card.Content>
        <List horizontal className="flex" style={styles.flex}>
          <List.Item className="flex-1">
            <Input placeholder="Enter question here" className="w-full" />
          </List.Item>
          <List.Item className="flex-1">
            <List style={styles.p0}>
              {_.map(_.range(0, answers), (_, index) => (
                <List.Item key={index} className="flex" style={styles.flex}>
                  <Input placeholder="Enter answer here" className="w-full" />
                  <IconButton
                    circular
                    icon
                    color="white"
                    name="x"
                    size="small"
                    onClick={() => setAnswers(answers - 1)}
                  />
                </List.Item>
              ))}
              <List.Item style={styles.textAlignRight}>
                <IconButton
                  circular
                  icon
                  color="white"
                  iconColor="green"
                  name="plus"
                  size="small"
                  onClick={() => setAnswers(answers + 1)}
                />
              </List.Item>
            </List>
          </List.Item>
        </List>
      </Card.Content>
    </Card>
  )
}
