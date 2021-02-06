/** @format */

import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default function () {
  return (
    <Menu>
      <Link to="/">
        <Menu.Item name="home" />
      </Link>
    </Menu>
  )
}
