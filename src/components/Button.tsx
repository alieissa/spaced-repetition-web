/** @format */

import { Button, ButtonOrProps } from 'semantic-ui-react'

const styles = {
  borderRadius: 0,
}
// TODO Replace with custom button. Want to eventually move away from Semantic
export default function SPButton(props: ButtonOrProps) {
  return <Button {...props} style={styles} />
}
