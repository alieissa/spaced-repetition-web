/** @format */

import {
  ListContent,
  ListDescription,
  ListHeader,
  ListItem,
} from 'semantic-ui-react'
import { NDecks } from './decks.types'

export default function DecksListItem(props: NDecks.Deck) {
  return (
    <ListItem>
      <ListContent>
        <ListHeader as="a">{props.name}</ListHeader>
        <ListDescription as="a">{props.description}</ListDescription>
      </ListContent>
    </ListItem>
  )
}
