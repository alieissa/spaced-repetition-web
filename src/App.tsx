/** @format */

import { createBrowserHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Grid } from 'semantic-ui-react'
import Auth0Provider from 'src/modules/auth/Auth0Provider'
import './App.css'
import SideNav from './modules/TopNav'
import Routes from './Routes'

export default function App() {
  const history = createBrowserHistory()
  return (
    <>
      <Auth0Provider>
        <Router history={history}>
          <>
            <SideNav />
            <div style={{ marginLeft: 250 }}>
              <Grid padded grid="true" columns={16} style={{ maxWidth: 1080 }}>
                <Grid.Column width={14}>
                  <Routes />
                </Grid.Column>
              </Grid>
            </div>
          </>
        </Router>
      </Auth0Provider>
    </>
  )
}
