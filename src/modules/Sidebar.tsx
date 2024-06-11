/** @format */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Menu, MenuItem, Sidebar } from 'semantic-ui-react'
import { styles } from 'src/styles'
import { useLogout } from './auth/auth.hooks'

export default function SPSidebar() {
  const navigate = useNavigate()
  const [logoutStatus, logout] = useLogout()

  // Does not make sense to NOT allow a user to logout
  // so we navigate to login page regardless of status of
  // logout call. The auth token is removed immediately.
  useEffect(() => {
    if (logoutStatus.type === 'Untriggered') {
      return
    }
    navigate('/login')
  }, [logoutStatus.type])

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
        data-testid="sidebar-logout-menu-item"
        as="a"
        // Override very specific semantic ui css rule
        style={{ ...styles.absolute, ...styles.b0 }}
        onClick={() => logout()}
      >
        <Icon name="log out" />
        Logout
      </MenuItem>
    </Sidebar>
  )
}
