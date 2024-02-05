/** @format */

import '@testing-library/jest-dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { act } from '@testing-library/react'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import Logout from '../Logout'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const logoutUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/logout`

const handlers = [
  rest.get(logoutUrl, (__, res, ctx) => {
    return res(ctx.status(200))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Logout', () => {
  describe('interaction', () => {
    it.only('should redirect to login', async () => {
      renderWithProviders(<Logout />)

      await act(flushPromises)

      expect(mockNavigate).toBeCalledWith('/login')
    })
  })
})
