/** @format */

import { Button, ButtonProps, Icon } from 'semantic-ui-react'

export default function ImportButton(props: ButtonProps) {
  return (
    <Button {...props}>
      <Icon name="upload" />
    </Button>
  )
}
