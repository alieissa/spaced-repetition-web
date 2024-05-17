/** @format */

import { List, ListItemProps } from 'semantic-ui-react'
const styles = {
  padding: 0,
}
export default function SPListItem(props: ListItemProps) {
  return <List.Item {...props} style={{ ...props.style, ...styles }} />
}
