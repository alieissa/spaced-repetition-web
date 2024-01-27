/** @format */
// TODO Add type guards to detect HTTP error type
import { Left, Right } from './utils/either'

type UseRequestParams = {
  url: string
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
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

export function request<D = {}>({
  url,
  method,
  token: overridToken,
}: UseRequestParams) {
  const token = overridToken || localStorage.getItem('token')
  return (data?: D) => {
    const authHeader =
      token || url !== 'users/login'
        ? { Authorization: `Bearer ${token}` }
        : undefined

    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/${url}`
    const headers = {
      ...authHeader,
      Accept: 'application/json, plain/text',
      'Content-Type': 'application/json',
    }
    const init = data
      ? { method, headers, body: JSON.stringify(data) }
      : { method, headers }

    return fetch(apiUrl, init)
      .then(isResponse4xx)
      .then(isResponse5xx)
      .then((r) => {
        // TODO Detect response header Content-Type and
        // treat accordingly. To do that must update the
        // user management service to return Content-Type
        // in header response
        if (url === 'users/verify') {
          return r.text()
        }
        return r.json()
      })
      .then((data) => {
        // TODO Move this to login reducer
        if (url === "users/login") {
          localStorage.setItem('token', data.token)
        }
        return data
      })
      .then((data) => Right<D>(data))
      .catch((error) => {
        return Left({ message: error.message, cause: error.cause })
      })
  }
}
