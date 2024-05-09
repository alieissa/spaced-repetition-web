/** @format */

import { Modal, ModalProps } from 'semantic-ui-react'

// TODO Replace with custom Modal. Want to eventually move away from Semantic UI
export default function SPModal(props: ModalProps) {
  return <Modal {...props} dimmer="inverted" centered={false} />
}
