/** @format */

import * as _ from 'lodash'
import { Link } from 'react-router-dom'
import { Button, ButtonProps } from 'semantic-ui-react'

interface Props {
  createLink: string
}
export default function CreateButton(props: Props & ButtonProps) {
  return (
    <Link to={props.createLink}>
      <Button color="blue" size="medium" icon {..._.omit(props, 'createLink')}>
        Create New Deck
      </Button>
    </Link>
  )
}
