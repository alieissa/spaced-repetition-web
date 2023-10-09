/** @format */

import { Left, Right } from './utils/either'

type UseRequestParams = {
  url: string
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
}

const HTTPError4xx = () => {
  return new Error('Invalid data entered')
}
const HTTPError5xx = () => {
  return new Error('Something went wrong')
}

const isResponse4xx = (response: Response) => {
  if (response.status < 500 && response.status > 399) {
    throw HTTPError4xx()
  }

  return response
}

const isResponse5xx = (response: Response) => {
  if (response.status < 600 && response.status > 499) {
    throw HTTPError5xx()
  }

  return response
}

export function request<D = {}>({ url, method }: UseRequestParams) {
  const token = localStorage.getItem('token')
  return (data?: D) => {
    const token = localStorage.getItem('token')
    const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/${url}`
    const headers = {
      ...authHeader,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    const init = data
      ? { method, headers, body: JSON.stringify(data) }
      : { method, headers }

    return fetch(apiUrl, init)
      .then(isResponse4xx)
      .then(isResponse5xx)
      .then((r) => r.json())
      .then((data) => Right<D>(data))
      .catch((error) => {
        return Left(error.message)
      })
  }
}
