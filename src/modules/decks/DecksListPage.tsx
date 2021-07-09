/** @format */

import * as _ from 'lodash'
import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header } from 'semantic-ui-react'
import 'src/App.css'
import { async } from 'src/utils'
import { CreateButton } from '../../components'
import Deck from './Deck'
import { useDecks } from './decks.hooks'
import { Decks } from './decks.types'

type Props = {
  readonly decks: ReadonlyArray<Decks.Deck>
}
export function DecksComponent(props: Props) {
  return (
    <Container className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton createLink="/decks/new" />
      </section>
      <Grid doubling stackable>
        {_.map(_.values(props.decks), (d) => (
          <Grid.Column width={4} key={d.id}>
            <Deck {...d} className="h-full" />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

// TODO Add compononent for non-success states
function withDecks<T>(Component: React.ComponentType<T>) {
  return (props: Omit<T, 'decks'>) => {
    const { status, decks } = useDecks()
    return async.match(status)({
      Untriggered: () => <div>Untriggered</div>,
      Loading: () => <div>Loading</div>,
      Failure: () => <div>Failure</div>,
      Success: () => <Component decks={decks} {...(props as T)} />,
    })
  }
}

export default withDecks(DecksComponent)
