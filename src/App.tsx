/** @format */

import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Grid } from 'semantic-ui-react'
import SideNav from 'src/modules/TopNav'
import './App.css'
import Routes from './Routes'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
