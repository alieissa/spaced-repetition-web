/** @format */

import * as _ from 'lodash'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Container,
  Grid,
  Header,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react'
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
    <Container data-testid="decks-list-success" className="w-max-xl">
      <section className="justify-space-between">
        <Header as="h2">Decks</Header>
        <CreateButton createLink="/decks/new" />
      </section>
      {_.isEmpty(props.decks) ? (
        <Segment placeholder>
          <Header icon>
            <Icon name="file" />
            No Decks created
          </Header>
          <CreateButton createLink="/decks/new" />
        </Segment>
      ) : (
        <Grid doubling stackable>
          {_.map(_.values(props.decks), (d) => (
            <Grid.Column width={4} key={d.id}>
              <Deck {...d} className="h-full" />
            </Grid.Column>
          ))}
        </Grid>
      )}
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
      navigate('/login')
    }
  }, [status.type])

  return async.match(status)({
    Untriggered: () => null,
    Failure: ({ value }) => {
      if (isUnauthorized(value)) {
        // This case is handled in useEffect
        return null
      }

      return <Segment data-testid="decks-list-failure"></Segment>
    },
    Loading: () => (
      <Segment data-testid="decks-list-loading">
        <Loader active></Loader>
      </Segment>
    ),
    Success: () => <DecksComponent decks={decks} />,
  })
}
