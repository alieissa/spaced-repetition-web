/** @format */

import { Card, CardProps } from 'semantic-ui-react'

const styles = {
  boxShadow: 'none',
  border: '1px solid',
  borderRadius: 'unset',
  marginTop: 0,
}
export default function SPCard(props: CardProps) {
  return <Card {...props} style={{ ...props.style, ...styles }} />
}
