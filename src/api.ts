/** @format */
// TODO Add type guards to detect HTTP error type
import _ from 'lodash'
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

export function request<D = {}>(params: UseRequestParams) {
  const token = params.token || localStorage.getItem('token')
  const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/${params.url}`

  const authHeader =
    token || params.url !== 'users/login'
      ? { Authorization: `Bearer ${token}` }
      : undefined

  const defaultHeaders =  _.isEmpty(params.headers) ? {
    'Content-Type': 'application/json',
    Accept: 'application/json, plain/text',
  }: params.headers

  const updatedHeaders = Object.entries({
    ...authHeader,
    ...defaultHeaders,
  }).reduce<Headers>((headers, [headerKey, headerValue]: [string, string]) => {
    headers.set(headerKey, headerValue)
    return headers
  }, new Headers())

  return (data?: D) => {
    const init = data
      ? {
          method: params.method,
          headers: updatedHeaders,
          body:
            updatedHeaders.get('Content-Type') === 'application/json'
              ? JSON.stringify(data)
              : data,
        }
      : { method: params.method, headers: updatedHeaders }

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
        if (params.url === 'decks/upload') {
          return null
        }
        return r.json()
      })
      .then((data) => {
        // TODO Move this to login reducer
        if (params.url === 'users/login') {
          localStorage.setItem('token', data.token)
        }
        return data
      })
      .then((data) => Right<D>(data))
      .catch((error) => {
        // console.log('error', error)
        return Left({ message: error.message, cause: error.cause })
      })
  }
}
