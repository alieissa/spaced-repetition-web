/** @format */

import { ListContent, ListItem } from 'semantic-ui-react'
import Deck from './Deck'
import { NDecks } from './decks.types'

export default function DecksListItem(props: NDecks.Deck) {
  return (
    <ListItem>
      <ListContent>
        <Deck {...props} />
      </ListContent>
    </ListItem>
  )
}
