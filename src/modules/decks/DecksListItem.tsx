/** @format */

import clsx from 'clsx'
import { SPListItem } from 'src/components'
import Deck from './Deck'
import { NDecks } from './decks.types'
type Props = NDecks.Deck & {
  disabled: boolean
}

export default function DecksListItem(props: Props) {
  return (
    <div className={clsx({ 'not-allowed-cursor': props.disabled })}>
      <SPListItem className={clsx({ disabled: props.disabled })}>
        <Deck {...props} />
      </SPListItem>
    </div>
  )
}
