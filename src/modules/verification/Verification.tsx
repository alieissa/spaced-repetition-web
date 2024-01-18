/** @format */

import { useNavigate } from 'react-router-dom'
import { Loader, Message, Segment } from 'semantic-ui-react'
import { async } from 'src/utils'
import { useVerification } from './verification.hooks'

function Verification() {
  const navigate = useNavigate()
  const { status } = useVerification()

  return async.match(status)({
    Untriggered: () => {
      return (
        <Segment data-testid="verification">
          <Loader active></Loader>
        </Segment>
      )
    },
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
      <Segment data-testid="verification-success">
        <Message success>
          <Message.Header>
            Your email has been verified.You can now log in
          </Message.Header>
        </Message>
      </Segment>
    ),
  })
}

export default Verification
