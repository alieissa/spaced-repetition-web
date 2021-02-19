/** @format */

import _ from 'lodash'
import React, { useState } from 'react'
import { Button, Card, Header, Icon } from 'semantic-ui-react'
import { styles } from 'src/styles'
import { Settings } from '.'

interface DeckInfoProps {
  readonly onDelete?: (id: Deck['id']) => void
  readonly onEdit?: (id: Deck['id']) => void
  readonly onSubmitSettings?: (id: Deck['id'], settings: Settings) => void
}
/**
 * Displays the name and description of a deck. User can
 *  1. Delete card if onDelete callback is defined
 *  2. Update settings of deck if onSubmitSettings callback is defined
 *  3. Edit name and description of deck if onEdit callback is defined
 */
export default function DeckInfo(props: Partial<DeckInfoProps> & Deck) {
  const [open, setOpen] = useState(false)

  return (
    <Card fluid style={styles.boxShadowNone}>
      <Card.Content
        className="justify-space-between"
        style={{ ...styles['pl-0'], ...styles['pt-0'] }}
      >
        <span className="flex-1" style={{ width: '100%' }}>
          <Header as="h2">{props.name}</Header>
          <Card.Description>{props.description}</Card.Description>
        </span>
        <span>
          {props.onEdit && (
            <Button
              circular
              style={styles.bgWhite}
              icon={<Icon name="pencil" />}
              onClick={() => (props.onEdit || _.noop)(props.id)}
            />
          )}
          {props.onDelete && (
            <Button
              style={styles.bgWhite}
              icon={<Icon name="x" color="red" />}
              onClick={() => (props.onDelete || _.noop)(props.id)}
            />
          )}
          {props.onSubmitSettings && (
            <Settings
              id={props.id}
              open={open}
              easiness={props.easiness}
              quality={props.quality}
              interval={props.interval}
              trigger={
                <Button
                  style={styles.bgWhite}
                  icon={<Icon name="setting" />}
                  onClick={() => setOpen(true)}
                />
              }
              onCancel={() => setOpen(false)}
              onSave={(settings) =>
                (props.onSubmitSettings || _.noop)(props.id, settings)
              }
            />
          )}
        </span>
      </Card.Content>
    </Card>
  )
}
