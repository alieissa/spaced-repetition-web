/** @format */

import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react'
import { createBrowserHistory } from 'history'
import React from 'react'

export const history = createBrowserHistory()

const onRedirectCallback: Auth0ProviderOptions['onRedirectCallback'] = (
  appState,
) => {
  console.log('appState', appState)
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname)
}

type WrapperProps = {
  children: React.ReactNode
}
export default function Auth0ProviderWrapper({ children }: WrapperProps) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || 'test'}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
