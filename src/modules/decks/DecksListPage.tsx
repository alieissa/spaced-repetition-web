/** @format */

import _ from 'lodash'
import { PropsWithChildren, useEffect } from 'react'
import { useSelector } from 'react-redux'
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
import { styles } from 'src/styles'
import { async } from 'src/utils'
import DecksDownload from './DecksDownload'
import DecksListItem from './DecksListItem'
import DecksUploadModal from './DecksUploadModal'
import { useDecks } from './decks.hooks'
import * as Select from './decks.selectors'
import { NDecks } from './decks.types'

type Props = {
  decks: Record<NDecks.Deck['id'], NDecks.Deck>
}

function DecksHeader() {
  return (
    <div className="justify-space-between bordered p-1r">
      <SPHeader as="h1">Decks</SPHeader>
      <div>
        <CreateButton createLink="/decks/new" />
        <DecksDownload />
        <DecksUploadModal />
      </div>
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

function DecksComponent(props: PropsWithChildren<any>) {
  return (
    <div
      data-testid="decks-list-success"
      className="flex-column h-full"
      style={styles['ofy-auto']}
    >
      <DecksHeader />
      <Grid padded style={styles.flexGrow1}>
        <GridRow stretched>
          <GridColumn width={4} style={styles['pl-0']}>
            {props.children}
          </GridColumn>
          <GridColumn width={12} style={styles['pr-0']}>
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
  const [status, decks] = useDecks()

  useEffect(() => {
    async.match(status)({
      Untriggered: () => null,
      Loading: () => null,
      Success: () => {
        navigate(`${decks[0].id}`)
      },
      Failure: ({ value }) => {
        if (isUnauthorized(value)) {
          // TODO Add query params so that message for navigation resulting from
          // 401 is displayed
          navigate('/login')
        }
      },
    })
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
    Success: () => (
      <DecksComponent decks={decks}>
        <div className="bordered">
          {_.isEmpty(decks) ? (
            <DecksEmpty />
          ) : (
            <SPList divided relaxed>
              {_.map(_.values(decks), (d) => (
                <DecksListItemContainer {...d} key={d.id} />
              ))}
            </SPList>
          )}
        </div>
      </DecksComponent>
    ),
  })
}

function DecksListItemContainer(props: NDecks.Deck) {
  const deleteStatus = useSelector(Select.deleteStatus(props.id))
  return <DecksListItem {...props} disabled={deleteStatus.type === 'Success'} />
}
