/** @format */

import { Header, Icon, Segment } from 'semantic-ui-react'
import CreateButton from './CreateButton'

interface Props {
  message: string
  createLink: string
}
export default function Empty(props: Props) {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="clone outline" />
        {props.message}
      </Header>
      <CreateButton createLink={props.createLink} />
    </Segment>
  )
}
