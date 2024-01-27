/** @format */

import * as _ from 'lodash'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header } from 'semantic-ui-react'
import 'src/App.css'
import { isUnauthorized } from 'src/api'
import { CreateButton } from 'src/components'
import { async } from 'src/utils'
import Deck from './Deck'
import { useDecks } from './decks.hooks'
import { NDecks } from './decks.types'

type Props = {
  readonly decks: Record<NDecks.Deck['id'], NDecks.Deck>
}
function DecksComponent(props: Props) {
  return (
    <Container className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton createLink="/decks/new" />
      </section>
      <Grid doubling stackable>
        {_.isEmpty(props.decks) ? (
          <div>Empty</div>
        ) : (
          _.map(_.values(props.decks), (d) => (
            <Grid.Column width={4} key={d.id}>
              <Deck {...d} className="h-full" />
            </Grid.Column>
          ))
        )}
      </Grid>
    </Container>
  )
}

/**
 * TODO
 * 1. Add compononent for non-success states
 * 2. Update login page to display error when navigation is result of 401
 */
export default function Decks() {
  const navigate = useNavigate()
  const { status, decks } = useDecks()

  useEffect(() => {
    if (status.type !== 'Failure') {
      return
    }

    if (isUnauthorized(status.value)) {
      // TODO Add query params so that message for navigation resulting from
      // 401 is displayed
      navigate('/logout')
    }
  }, [status.type])

  return async.match(status)({
    Untriggered: () => <div>Untriggered</div>,
    Loading: () => <div>Loading</div>,
    Failure: () => null,
    Success: () => <DecksComponent decks={decks} />,
  })
}
