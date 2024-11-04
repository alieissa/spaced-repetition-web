/** @format */

import { createRoot } from 'react-dom/client'

import axios from 'axios'
import App from './App'
import AppContext from './app.context'
import './index.css'

const token =
  localStorage.getItem('token') || sessionStorage.getItem('token') || ''

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json, plain/text',
  },
})

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(
  <AppContext.Provider value={{ api: axiosInstance }}>
    <App />
  </AppContext.Provider>,
)
