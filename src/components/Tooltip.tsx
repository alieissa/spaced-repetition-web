/** @format */

import * as _ from 'lodash'
import { Popup, PopupProps } from 'semantic-ui-react'

export default function Tooltip(props: PopupProps) {
  return (
    <Popup trigger={props.children} {..._.omit(props, 'trigger', 'children')} />
  )
}
