/** @format */

import { Left, Right } from 'src/utils/either'
type UseRequestParams = {
  url: string
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
}
/**
 * Returns a fetch that has the access token included in the header.
 * Auth0 only gives access to access token from a hook, so forced to
 * create a hook around it. There is the option to save the access
 * token in localStorage but that is not recommended and is also
 * difficult because there is no easy way to know the key under which
 * the access token is saved
 */
export function useAuthRequest<D = {}>({ url, method }: UseRequestParams) {
  const token = localStorage.getItem('token')
  const authFetch = (data?: D) => {
    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/${url}`
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    const init = data
      ? { method, headers, body: JSON.stringify(data) }
      : { method, headers }

    return fetch(apiUrl, init)
      .then((r) => r.json())
      .then((data) => Right<D>(data))
      .catch((error) => Left(error))
  }
  return authFetch
}
