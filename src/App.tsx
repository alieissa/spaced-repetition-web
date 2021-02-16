/** @format */

import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Grid } from 'semantic-ui-react'
import './App.css'
import SideNav from './modules/TopNav'
import Routes from './Routes'

export default function App() {
  return (
    <>
      <Router>
        <SideNav />
        <div style={{ marginLeft: 250 }}>
          <Grid padded grid="true" columns={16} style={{ maxWidth: 1080 }}>
            <Grid.Column width={14}>
              <Routes />
            </Grid.Column>
          </Grid>
        </div>
      </Router>
    </>
  )
}
