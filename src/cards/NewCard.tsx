/** @format */

import * as _ from 'lodash'
import React, { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Icon, Input, List } from 'semantic-ui-react'
import '../App.css'
import { styles } from '../styles'
export default function NewCard() {
  const [answers, setAnswers] = useState(1)
  if (answers === 0) {
    return null
  }
  return (
    <Card fluid className="flex-1">
      <Card.Header textAlign="right">
        <Button circular icon style={styles.bgWhite}>
          <Icon name="x" onClick={() => setAnswers(0)}></Icon>
        </Button>
      </Card.Header>
      <Card.Content>
        <List horizontal className="flex" style={styles.flex}>
          <List.Item className="flex-1">
            <Input placeholder="Enter question here" className="w-full" />
          </List.Item>
          <List.Item className="flex-1">
            <List style={styles.p0}>
              {_.map(_.range(0, answers), () => (
                <List.Item className="flex" style={styles.flex}>
                  <Input placeholder="Enter answer here" className="w-full" />
                  <Button
                    circular
                    icon
                    size="small"
                    style={styles.bgWhite}
                    onClick={() => setAnswers(answers - 1)}
                  >
                    <Icon name="x" />
                  </Button>
                </List.Item>
              ))}
              <List.Item style={styles.textAlignRight}>
                <Button
                  circular
                  icon
                  size="small"
                  style={styles.bgWhite}
                  onClick={() => setAnswers(answers + 1)}
                >
                  <Icon name="plus" color="green" />
                </Button>
              </List.Item>
            </List>
          </List.Item>
        </List>
      </Card.Content>
    </Card>
  )
}
