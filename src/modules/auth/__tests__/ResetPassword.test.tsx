/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
import ResetPassword from '../ResetPassword'
import { NAuth } from '../auth.types'

const resetPasswordUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/reset-password`

const email = faker.internet.email({ firstName: 'Johnny', lastName: 'Bravo' })
export const handlers = [
  rest.post(resetPasswordUrl, (__, res, ctx) => {
    return res(ctx.json({ email }))
  }),
]

const setupForm = async ({
  password,
  confirmedPassword,
}: NAuth.ResetPasswordForm) => {
  const user = userEvent.setup()

  const passwordInputElement = screen.getByTestId(
    'reset-password-form-password-input',
  )
  await act(() => user.type(passwordInputElement, password))

  const confirmedPasswordInputElement = screen.getByTestId(
    'reset-password-form-confirmed-password-input',
  )
  await act(() => user.type(confirmedPasswordInputElement, confirmedPassword))
}

const submitForm = async () => {
  const resetPasswordBtn = screen.getByTestId('reset-password-form-btn')
  await act(() => resetPasswordBtn.click())
}

const expectElementToBeInDocument = async (testId: string) => {
  const element = await screen.findByTestId(testId)
  await waitFor(() => expect(element).toBeInTheDocument())
}
const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ResetPassword', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<ResetPassword />)
      expect(asFragment()).toMatchSnapshot()
    })
    it('should display initial view', async () => {
      renderWithProviders(<ResetPassword />)
      await waitFor(() => expectElementToBeInDocument('reset-password-form'))
    })

    // Loading view not displayed so no test necessary
    // it('should display loading view', async ...)

    it('should display error view', async () => {
      // Assemble
      server.use(
        rest.post(resetPasswordUrl, (__, res, ctx) => {
          return res(ctx.status(422))
        }),
      )
      renderWithProviders(<ResetPassword />)
      const password = faker.internet.password()
      await setupForm({ password: password, confirmedPassword: password })

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('reset-password-form-error'),
      )
    })

    it('should display success view', async () => {
      // Assemble
      renderWithProviders(<ResetPassword />)
      const password = faker.internet.password()
      await setupForm({ password, confirmedPassword: password })

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('reset-password-form-success'),
      )
    })
  })

  describe('interaction', () => {
    it('should display error when password is invalid', async () => {
      // Assemble
      renderWithProviders(<ResetPassword />)
      const password = faker.internet.password({ length: 4 })
      await setupForm({ password, confirmedPassword: password })

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('reset-password-form-password-error'),
      )
    })

    it.todo(
      'should display error when confirmed password does not match password',
    )
  })
})
