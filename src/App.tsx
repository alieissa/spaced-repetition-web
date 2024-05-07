/** @format */

import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Routes from './Routes'
import SPSidebar from './modules/Sidebar'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ height: '100vh' }}>
        <SPSidebar></SPSidebar>
        <div className="h-full" style={{ paddingLeft: 90 }}>
          <Routes />
        </div>
      </div>
    </BrowserRouter>
  )
}
