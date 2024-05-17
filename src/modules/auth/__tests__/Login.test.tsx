/** @format */

import '@testing-library/jest-dom'
import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import Login from '../Login'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const loginUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/login`

export const handlers = [
  rest.post(loginUrl, (__, res, ctx) => {
    return res(ctx.json({ token: 'dummytoken1234' }))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Login', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<Login />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    test('display initial', async () => {
      renderWithProviders(<Login />)
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
    })

    test('display loading', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Login />)

      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))
      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      const testId = 'login-form-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    test('display failure', async () => {
      server.use(
        rest.post(loginUrl, (__, res, ctx) =>
          res(ctx.json({ email: 'invalidemail' }), ctx.status(422)),
        ),
      )

      renderWithProviders(<Login />)

      const user = userEvent.setup()
      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      const testId = 'login-form-error'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    test('display success', async () => {
      // Assemble
      renderWithProviders(<Login />)
      const user = userEvent.setup()
      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      // Act
      const loginBtn = await screen.findByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())
      await act(flushPromises)

      // Assert
      expect(mockNavigate).toBeCalledWith('/')
    })
  })
})
