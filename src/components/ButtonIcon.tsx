/** @format */

import clsx from 'clsx'
import { Button, ButtonOrProps } from 'semantic-ui-react'

const styles = {
  paddingLeft: 0,
  paddingRight: 0,
}
export default function SPButtonIcon(props: ButtonOrProps) {
  return (
    <Button
      {...props}
      className={clsx(props.className, 'sp-button')}
      style={{ ...props.style, ...styles }}
    />
  )
}
