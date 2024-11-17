/** @format */

import axios from 'axios'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Routes from './Routes'
import AppContext from './app.context'

const token =
  localStorage.getItem('token') || sessionStorage.getItem('token') || ''

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    ...(token !== '' && { Authorization: `Bearer ${token}` }),
    Accept: 'application/json, plain/text',
  },
})

const queryClient = new QueryClient()

export default function App() {
  const [token, setToken] = useState('')

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ api: axiosInstance, token, setToken }}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}
