/** @format */

import * as _ from 'lodash'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import { isUnauthorized } from 'src/api'
import { CreateButton, SPHeader, SPList } from 'src/components'
import { async } from 'src/utils'
import DecksListItem from './DecksListItem'
import { useDecks } from './decks.hooks'
import { NDecks } from './decks.types'

type Props = {
  decks: Record<NDecks.Deck['id'], NDecks.Deck>
}

function DecksHeader() {
  return (
    <div className="justify-space-between bordered p-1r">
      <SPHeader as="h1">Decks</SPHeader>
      <CreateButton createLink="/decks/new" />
    </div>
  )
}

function DecksEmpty() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="file" />
        No Decks created
      </Header>
      <CreateButton createLink="/decks/new" />
    </Segment>
  )
}

function DecksComponent(props: Props) {
  return (
    <div
      data-testid="decks-list-success"
      className="flex-column h-full"
      style={{ overflowY: 'auto' }}
    >
      <DecksHeader />
      <Grid padded style={{ flexGrow: 1 }}>
        <GridRow stretched>
          <GridColumn width={4} style={{ paddingLeft: 0 }}>
            <div className="bordered">
              {_.isEmpty(props.decks) ? (
                <DecksEmpty />
              ) : (
                <SPList divided relaxed>
                  {_.map(_.values(props.decks), (d) => (
                    <DecksListItem {...d} key={d.id} />
                  ))}
                </SPList>
              )}
            </div>
          </GridColumn>
          <GridColumn width={12} style={{ paddingRight: 0 }}>
            <div className="bordered">
              <Outlet />
            </div>
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
