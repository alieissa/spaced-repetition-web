/** @format */

import * as _ from 'lodash'
import { Link } from 'react-router-dom'
import { ButtonProps } from 'semantic-ui-react'
import { SPButton } from '.'

interface Props {
  createLink: string
}
export default function CreateButton(props: Props & ButtonProps) {
  return (
    <Link to={props.createLink}>
      <SPButton
        color="blue"
        size="medium"
        icon
        {..._.omit(props, 'createLink')}
      >
        Create New Deck
      </SPButton>
    </Link>
  )
}
