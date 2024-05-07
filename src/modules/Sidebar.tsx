/** @format */

import { useNavigate } from 'react-router-dom'
import { Icon, Menu, MenuItem, Sidebar } from 'semantic-ui-react'

export default function SPSidebar() {
  const navigate = useNavigate()
  return (
    <Sidebar
      as={Menu}
      visible={true}
      icon="labeled"
      vertical
      style={{ boxShadow: 'none', border: '1px solid' }}
    >
      <MenuItem as="a" onClick={() => navigate('/')}>
        <Icon name="home" />
        Decks
      </MenuItem>
    </Sidebar>
  )
}
