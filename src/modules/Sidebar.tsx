/** @format */

import { Icon, Menu, MenuItem, Sidebar } from 'semantic-ui-react'

export default function SPSidebar() {
  return (
    <Sidebar as={Menu} visible={true} icon="labeled" vertical>
      <MenuItem as="a">
        <Icon name="home" />
        Decks
      </MenuItem>
    </Sidebar>
  )
}
