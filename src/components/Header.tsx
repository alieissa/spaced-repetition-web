/** @format */

import { Header, HeaderProps } from 'semantic-ui-react'

const styles = {
  marginTop: 0,
}

export default function SPHeader(props: HeaderProps) {
  return <Header {...props} style={{ ...props.styles, ...styles }} />
}
