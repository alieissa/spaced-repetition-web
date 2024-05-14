/** @format */

import { Button, ButtonOrProps, Icon } from 'semantic-ui-react'

const styles = {
  paddingLeft: 0,
  paddingRight: 0,
  background: 'none',
}
export default function SPButtonIcon(props: ButtonOrProps) {
  return (
    <Button
      {...props}
      icon={<Icon color={props.color} name={props.icon} />}
      style={{ ...props.style, ...styles }}
    />
  )
}
