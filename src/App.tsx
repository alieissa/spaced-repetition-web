/** @format */

import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Grid } from 'semantic-ui-react'
import './App.css'
import Routes from './Routes'

export default function App() {
  return (
    <BrowserRouter>
      <>
        {/* TODO create HOC that adds TopNav to component */}
        {/* <TopNav /> */}
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
