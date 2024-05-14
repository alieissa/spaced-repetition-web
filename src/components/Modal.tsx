/** @format */

import { Modal, ModalProps } from 'semantic-ui-react'

const styles = {
  boxShadow: 'none',
  border: '1px solid',
  borderRadius: 0,
}
// TODO Replace with custom Modal. Want to eventually move away from Semantic UI
export default function SPModal(props: ModalProps) {
  return <Modal {...props} dimmer="inverted" centered={false} style={styles} />
}
