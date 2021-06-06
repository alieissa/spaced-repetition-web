/** @format */

import React from 'react'
import { RouteProps } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Card, Container } from 'semantic-ui-react'
import 'src/App.css'
import { DeckInfo } from 'src/components'
import { styles } from 'src/styles'
import TestQuestion from '../questions/TestQuestion'

/**
 * Displays a series of questions that user must answer. User update settings of a question and
 * record an incorrect answer as a correct one
 */
export default function DeckTestPage(__: RouteProps) {
  return (
    <Container className="w-max-xl">
      <Card fluid style={styles.boxShadowNone}>
        <Card.Content
          className="justify-space-between relative"
          style={{ ...styles['px-0'], ...styles['pt-0'] }}
        >
          <DeckInfo
            id="dummyId2"
            name="Deck 2"
            description="Dummy deck description"
            questions={[]}
          />
        </Card.Content>
      </Card>
      <TestQuestion />
    </Container>
  )
}
