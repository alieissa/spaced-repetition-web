/** @format */

import { Loader, Message, Segment } from 'semantic-ui-react'
import { async } from 'src/utils'
import { useVerification } from './verification.hooks'

function Verification() {
  const { status } = useVerification()

  return async.match(status)({
    Untriggered: () => (
      <Segment data-testid="verification">
        <div>Untriggered</div>
      </Segment>
    ),
    Loading: () => (
      <Segment data-testid="verification-loading">
        <Loader active></Loader>
      </Segment>
    ),
    Failure: () => (
      <Segment data-testid="verification-error">
        <Message negative>
          <Message.Header>Verification failed</Message.Header>
          <p>Please try again.</p>
        </Message>
      </Segment>
    ),
    Success: () => (
      <Segment data-testid="verification-successful">
        <Message positive>
          <Message.Header>Verification successful</Message.Header>
          {/* TODO: Navigate to main page */}
          <p>Click here to go to app</p>
        </Message>
      </Segment>
    ),
  })
}

export default Verification
