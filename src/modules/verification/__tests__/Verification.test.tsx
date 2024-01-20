/** @format */

import '@testing-library/jest-dom'
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import Verification from '../Verification'

const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const verifyUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/verify`
export const handlers = [
  rest.get(verifyUrl, (__, res, ctx) => {
    return res(ctx.text('Your email has been verified.'), ctx.status(200))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Verification', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<Verification />)
      expect(asFragment()).toMatchSnapshot()
    })

    it('should display loading', async () => {
      server.use(
        rest.get(verifyUrl, (__, res, ctx) =>
          res(ctx.text('Your email has been verified'), ctx.status(200)),
        ),
      )
      renderWithProviders(<Verification />)

      const testId = 'verification-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    it('should display failure', async () => {
      server.use(rest.get(verifyUrl, (__, res, ctx) => res(ctx.status(422))))

      renderWithProviders(<Verification />)

      const testId = 'verification-error'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    it('should display success', async () => {
      renderWithProviders(<Verification />)

      await act(flushPromises)

      const testId = 'verification-success'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })
})
