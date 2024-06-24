/** @format */

import '@testing-library/jest-dom'
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom'
import { renderWithProviders, withRedux } from 'src/utils/test-utils'
import ForgotPassword from '../ForgotPassword'
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

// TODO Update renderWithProviders to accept routes instead of a component
// or move/create this helper to test-util
const setupRouter = (routes: RouteObject[], initialEntries: string[]) => {
  const router = createMemoryRouter(routes, { initialEntries })
  return <RouterProvider router={router} />
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
      const formLoading = await screen.findByTestId(testId)
      await waitFor(() => expect(formLoading).toBeInTheDocument())
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
      const errorElement = await screen.findByTestId(testId)
      await waitFor(() => expect(errorElement).toBeInTheDocument())
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

    it('Should navigate to signup page when signup button clicked', async () => {
      // Assemble
      renderWithProviders(<Login />)
      await setupForm([])

      // Act
      const signupBtn = await screen.findByTestId('login-form-signup-button')
      await act(() => signupBtn.click())

      // Assert
      await waitFor(() => expect(mockNavigate).toBeCalledWith('/signup'))
    })

    it('Should navigate to forgot password page when forgot password link clicked', async () => {
      // Assemble
      // Ensures that Login component is rendered by default
      const initialEntries = ['/login']
      const routes = [
        { path: '/login', element: <Login /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
      ]
      render(withRedux(setupRouter(routes, initialEntries)))
      await setupForm([])

      // Act
      const forgotPasswordLink = await screen.findByTestId(
        'login-form-forgot-password-link',
      )
      await act(() => forgotPasswordLink.click())

      // Assert
      const forgotPasswordPage = await screen.findByTestId(
        'forgot-password-page',
      )
      await waitFor(() => expect(forgotPasswordPage).toBeInTheDocument())
    })
  })
})
