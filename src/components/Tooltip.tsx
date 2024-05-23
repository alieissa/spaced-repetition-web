/** @format */

import * as _ from 'lodash'
import { Popup, PopupProps } from 'semantic-ui-react'

const styles = {
  boxShadow: 'unset',
  borderRadius: 0,
}
export default function Tooltip(props: PopupProps) {
  return (
    <Popup
      basic
      trigger={props.children}
      style={styles}
      {..._.omit(props, 'trigger', 'children')}
    />
  )
}
