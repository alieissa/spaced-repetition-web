/** @format */

import '@testing-library/jest-dom'
import {
  act,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
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
// const formFields = ['email', 'password'] as const

const setupForm = async (fields: ('email' | 'password')[]) => {
  const user = userEvent.setup()

  if (fields.includes('email')) {
    const emailInput = screen.getByTestId('login-form-email-input')
    await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
  }

  if (fields.includes('password')) {
    const passwordInput = screen.getByTestId('login-form-password-input')
    await act(() => user.type(passwordInput, 'heythere!'))
  }
}

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
    test('display initial', async () => {
      renderWithProviders(<Login />)
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
    })

    test('display loading', async () => {
      // Assemble
      renderWithProviders(<Login />)
      await setupForm(['email', 'password'])

      // Act
      const loginBtn = screen.getByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())

      // Assert
      const testId = 'login-form-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    test('display failure', async () => {
      // Assemble
      server.use(
        rest.post(loginUrl, (__, res, ctx) =>
          res(ctx.json({ email: 'invalidemail' }), ctx.status(422)),
        ),
      )
      renderWithProviders(<Login />)
      await setupForm(['email', 'password'])

      // Act
      const loginBtn = screen.getByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())

      // Assert
      const testId = 'login-form-error'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    test('display success', async () => {
      // Assemble
      renderWithProviders(<Login />)
      await setupForm(['email', 'password'])

      // Act
      const loginBtn = await screen.findByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())

      // Assert
      await waitFor(() => expect(mockNavigate).toBeCalledWith('/'))
    })
  })

  describe('interaction', () => {
    it('Should display error when email is invalid', async () => {
      // Assemble
      renderWithProviders(<Login />)
      await setupForm(['password'])

      // Act
      const loginBtn = await screen.findByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())

      // Assert
      const emailError = await screen.findByTestId('login-form-email-error')
      expect(emailError).toBeInTheDocument()
    })

    it('Should display error when password is invalid', async () => {
      // Assemble
      renderWithProviders(<Login />)
      await setupForm(['email'])

      // Act
      const loginBtn = await screen.findByRole('button', { name: 'Login' })
      await act(() => loginBtn.click())

      // Assert
      const passwordError = await screen.findByTestId(
        'login-form-password-error',
      )
      expect(passwordError).toBeInTheDocument()
    })
  })
})
