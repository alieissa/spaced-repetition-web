/** @format */

import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Routes from './Routes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}
