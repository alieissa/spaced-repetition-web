/** @format */

import { Loader, Message, Segment } from 'semantic-ui-react'
import { useVerifyUserQuery } from './verification.hooks'

function Verification() {
  const queryResult = useVerifyUserQuery()

  switch (queryResult.status) {
    case 'idle': {
      return (
        <Segment data-testid="verification">
          <Loader active></Loader>
        </Segment>
      )
    }
    case 'loading': {
      return (
        <Segment data-testid="verification-loading">
          <Loader active></Loader>
        </Segment>
      )
    }
    case 'error': {
      return (
        <Segment data-testid="verification-error">
          <Message negative>
            <Message.Header>Verification failed</Message.Header>
            <p>Please try again.</p>
          </Message>
        </Segment>
      )
    }
    case 'success': {
      return (
        <Segment data-testid="verification-success">
          <Message success>
            <Message.Header>
              Your email has been verified.You can now log in
            </Message.Header>
          </Message>
        </Segment>
      )
    }
  }
}

export default Verification
