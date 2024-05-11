/** @format */

import { Input, InputProps } from 'semantic-ui-react'

const inputStyles = {
  borderTop: 'none',
  borderRight: 'none',
  borderLeft: 'none',
  borderRadius: 'unset',
}
const containerStyles = { opacity: 1 }
export default function Text(props: InputProps) {
  return (
    <Input
      {...props}
      disabled
      style={containerStyles}
      input={<input style={inputStyles} />}
    />
  )
}
