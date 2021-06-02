/** @format */

import React, { MouseEventHandler, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Button, Icon, Segment } from 'semantic-ui-react'
import { QuestionForm, Settings } from 'src/components'
import { styles } from 'src/styles'
import '../App.css'
import { createAnswer, createDeck } from './helpers'

/**
 * Displays the card (question) content or edit form when user selects edit. User can
 * also delete or update settings of a card (question) in this component
 */
export default function Question(props: Question) {
  const [editing, setEditing] = useState(false)
  return (
    <Segment className="justify-space-between align-center">
      {editing ? (
        <QuestionForm
          content="question"
          answers={[
            createAnswer({ content: 'ansewer 1' }),
            createAnswer({ content: 'answer 2' }),
          ]}
          onSubmitForm={() => console.log('question form')}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <QuestionContent
          content={props.content}
          onEdit={() => setEditing(true)}
          onDelete={() => console.log('on delete')}
          onSubmitSettings={() => console.log('submitSettings')}
        />
      )}
    </Segment>
  )
}

interface QuestionContentProps {
  onEdit: MouseEventHandler
  onDelete: MouseEventHandler
  // TODO add type
  onSubmitSettings: any
}
/**
 * Displays the content of the question and the delete, edit and settings buttons
 * from which user can delete, open edit form, or open settings menu
 */
function QuestionContent(props: WithQuestion<QuestionContentProps, 'content'>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <span className="ellipsis">{props.content}</span>
      <span>
        <Button
          style={styles.bgWhite}
          icon={<Icon name="pencil" />}
          onClick={props.onEdit}
        />
        <Button
          style={styles.bgWhite}
          icon={<Icon name="x" color="red" />}
          onClick={props.onDelete}
        />
        <Settings
          id="dummyId2"
          deckId="dummyDeck1Id"
          decks={[
            createDeck({ name: 'Deck 1', id: 'dummyDeck1Id' }),
            createDeck({ name: 'Deck 2', id: 'dummyDeck2Id' }),
          ]}
          open={open}
          easiness={1}
          quality={1}
          interval={1}
          trigger={
            <Button
              style={styles.bgWhite}
              icon={<Icon name="setting" />}
              onClick={() => setOpen(true)}
            />
          }
          onCancel={() => setOpen(false)}
          onSave={props.onSubmitSettings}
        />
      </span>
    </>
  )
}
