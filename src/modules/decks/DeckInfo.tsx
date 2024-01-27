/** @format */

import _ from 'lodash'
import { Button, Card, Header, Icon } from 'semantic-ui-react'
import { styles } from 'src/styles'
import { Settings } from 'src/types'
import { NDecks } from './decks.types'

interface DeckInfoProps {
  readonly onDelete?: (id: NDecks.Deck['id']) => void
  readonly onEdit?: (id: NDecks.Deck['id']) => void
  readonly onSubmitSettings?: (
    id: NDecks.Deck['id'],
    settings: Settings,
  ) => void
}
/**
 * Displays the name and description of a deck. User can
 *  1. Delete card if onDelete callback is defined
 *  2. Update settings of deck if onSubmitSettings callback is defined
 *  3. Edit name and description of deck if onEdit callback is defined
 */
export default function DeckInfo(props: Partial<DeckInfoProps> & NDecks.Deck) {
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
        </span>
      </Card.Content>
    </Card>
  )
}
