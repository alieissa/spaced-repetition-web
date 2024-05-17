/** @format */

import _ from 'lodash'
import { Input, InputProps } from 'semantic-ui-react'

const inputStyles = {
  borderTop: 'none',
  borderRight: 'none',
  borderLeft: 'none',
  borderRadius: 'unset',
}
const containerStyles = { opacity: 1 }
export default function SPInput(props: InputProps) {
  return (
    <Input
      {..._.omit(props, 'data-testid')}
      style={containerStyles}
      input={
        <input
          data-testid={props['data-testid']}
          style={{ ...inputStyles, ...props.style }}
        />
      }
    />
  )
}
