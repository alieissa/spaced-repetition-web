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
      className="bordered bs-none"
    >
      <MenuItem as="a" onClick={() => navigate('/')}>
        <Icon name="home" />
        Decks
      </MenuItem>
      <MenuItem
        // Override very specific semantic ui css rule
        style={{ position: 'absolute', bottom: 0 }}
        as="a"
        onClick={() => navigate('/logout')}
      >
        <Icon name="log out" />
        Logout
      </MenuItem>
    </Sidebar>
  )
}
