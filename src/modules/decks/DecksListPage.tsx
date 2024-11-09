/** @format */

import { PropsWithChildren, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import {
  Card,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react'
import 'src/App.css'
import {
  CreateButton,
  SPCard,
  SPCardContent,
  SPCardHeader,
  SPHeader,
  SPList,
  SPListItem,
  UploadButton,
} from 'src/components'
import { styles } from 'src/styles'
import DeckDetails from './DeckDetails'
import DecksDownload from './DecksDownload'
import DecksUploadModal from './DecksUploadModal'
import { useDecksQuery } from './decks.hooks'

function DecksHeader() {
  const [isUploadModalOPen, setIsUploadModalOpen] = useState(false)

  return (
    <div className="justify-space-between bordered p-1r">
      <SPHeader as="h1">Decks</SPHeader>
      <div>
        <CreateButton createLink="/decks/new" />
        <DecksDownload />
        <UploadButton
          data-testid="decks-upload-modal-btn"
          onClick={() => setIsUploadModalOpen(true)}
        />
        {isUploadModalOPen && (
          <DecksUploadModal onClose={() => setIsUploadModalOpen(false)} />
        )}
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

function DecksComponent(props: PropsWithChildren<{ deck: Deck }>) {
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
              <DeckDetails id={props.deck.id} />
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
  const { status, data } = useDecksQuery()

  const [activeDeck, setActiveDeck] = useState(data?.data[0])

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'loading':
        return
      case 'success':
        const decks = data.data
        if (decks.length === 0) return
        navigate(`${decks[0].id}`)
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  switch (status) {
    case 'idle': {
      return null
    }
    case 'error': {
      return (
        <Segment data-testid="decks-list-failure">
          <div>Error</div>
        </Segment>
      )
    }
    case 'loading': {
      return (
        <Segment data-testid="decks-list-loading">
          <Loader active></Loader>
        </Segment>
      )
    }
    case 'success': {
      const decks = data.data
      return (
        <DecksComponent deck={activeDeck!}>
          <div className="bordered">
            {decks.length === 0 ? (
              <DecksEmpty />
            ) : (
              <SPList divided relaxed>
                {decks.map((d) => (
                  <SPListItem key={d.id}>
                    <SPCard
                      className="pointer"
                      style={{
                        width: '100%',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderLeft: 'none',
                      }}
                    >
                      <SPCardContent onClick={() => setActiveDeck(d)}>
                        <SPCardHeader size="large">{d.name}</SPCardHeader>
                        <Card.Description>{d.description}</Card.Description>
                      </SPCardContent>
                    </SPCard>
                  </SPListItem>
                ))}
              </SPList>
            )}
          </div>
        </DecksComponent>
      )
    }
  }
}
