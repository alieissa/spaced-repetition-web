/** @format */

import { Card, Header } from 'semantic-ui-react'
import { SPCard, SPCardContent } from 'src/components'
import { styles } from 'src/styles'
import { Settings } from 'src/types'

type Props = Deck & {
  onSubmitSettings?: (id: Deck['id'], settings: Settings) => void
}

export default function DeckInfo(props: Partial<Props>) {
  return (
    <SPCard fluid style={styles.boxShadowNone}>
      <SPCardContent
        className="justify-space-between"
        style={{ ...styles['pl-0'], ...styles['pt-0'] }}
      >
        <span className="flex-1" style={{ width: '100%' }}>
          <Header as="h2">{props.name}</Header>
          <Card.Description>{props.description}</Card.Description>
        </span>
      </SPCardContent>
    </SPCard>
  )
}
