/** @format */
// TODO Add type guards to detect HTTP error type

import { Left, Right } from './utils/either'

type UseRequestParams = {
  url: Request['url']
  method: RequestInit['method']
  headers?: Record<string, string>
  token?: string
}

export const isUnauthorized = (httpError: any) => {
  if (httpError.cause === 401) {
    return true
  }

  return false
}
const HTTPError4xx = (message: string, status: Response['status']) => {
  return new Error(message, { cause: status })
}
const HTTPError5xx = () => {
  return new Error('Something went wrong')
}

const isResponse4xx = (response: Response) => {
  if (response.status < 500 && response.status > 399) {
    throw HTTPError4xx(response.statusText, response.status)
  }

  return response
}

const isResponse5xx = (response: Response) => {
  if (response.status < 600 && response.status > 499) {
    throw HTTPError5xx()
  }

  return response
}

const getAuthHeader = (url: string, token: string | null) => {
  return token || url !== 'users/login'
    ? { Authorization: `Bearer ${token}` }
    : undefined
}

const getToken = (token?: string) => {
  return token || localStorage.getItem('token') || sessionStorage.getItem('token')
}

const getUrl = (url: string) => {
  return `${process.env.REACT_APP_API_ENDPOINT}/${url}`
}

const getHeaders = (headers: Record<string, string>) => {
  return Object.entries(headers).reduce<Headers>(
    (headers, [headerKey, headerValue]: [string, string]) => {
      headers.set(headerKey, headerValue)
      return headers
    },
    new Headers(),
  )
}

export function request<D = {}, R=D>(params: UseRequestParams) {
  const token = getToken(params.token)
  const apiUrl = getUrl(params.url)
  const authHeader = getAuthHeader(params.url, token)

  const headers = getHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json, plain/text',
    ...authHeader,
  })

  return (data?: D) => {
    const init = data
      ? {
          headers,
          method: params.method,
          body: JSON.stringify(data),
        }
      : { method: params.method, headers }

    return fetch(apiUrl, init as RequestInit)
      .then(isResponse4xx)
      .then(isResponse5xx)
      .then((r) => {
        // TODO Detect response header Content-Type and
        // treat accordingly. To do that must update the
        // user management service to return Content-Type
        // in header response
        if (params.url === 'users/verify') {
          return r.text()
        }
        if (params.url === 'users/logout') {
          return r.text()
        }
        if (params.url === 'users/forgot-password') {
          return r.text()
        }

        if (params.url === 'decks/download') {
          return r.text()
        }

        if (params.method === 'DELETE') {
          return r.text()
        }
        
        return r.json()
      })
      .then((data) => Right<R>(data))
      .catch((error) => Left({ message: error.message, cause: error.cause }))
  }
}

export function upload<D = FormData>(params: Omit<UseRequestParams, 'method'>) {
  const token = getToken(params.token)
  const apiUrl = getUrl(params.url)
  const authHeader = getAuthHeader(params.url, token)
  const headers = getHeaders(authHeader!)

  return (file: D) => {
    const init = { method: "POST", headers, body: file }

    return fetch(apiUrl, init as RequestInit)
      .then(isResponse4xx)
      .then(isResponse5xx)
      .then(() => Right(null))
      .catch((error) =>  Left({ message: error.message, cause: error.cause }))
  }
}
