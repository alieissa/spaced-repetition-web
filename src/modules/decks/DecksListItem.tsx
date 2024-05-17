/** @format */

import { SPListItem } from 'src/components'
import Deck from './Deck'
import { NDecks } from './decks.types'

export default function DecksListItem(props: NDecks.Deck) {
  return (
    <SPListItem>
      <Deck {...props} />
    </SPListItem>
  )
}
