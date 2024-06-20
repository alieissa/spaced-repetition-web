/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
import ForgotPassword from '../ForgotPassword'

const forgotPasswordUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/forgot-password`

const email = faker.internet.email({ firstName: 'Johnny', lastName: 'Bravo' })
export const handlers = [
  rest.post(forgotPasswordUrl, (__, res, ctx) => {
    return res(ctx.json({ email }))
  }),
]

const setupForm = async (fields: 'email'[]) => {
  const user = userEvent.setup()

  if (fields.includes('email')) {
    const emailInput = screen.getByTestId('forgot-password-form-email-input')
    await act(() => user.type(emailInput, email))
  }
}

const submitForm = async () => {
  const forgotPasswordBtn = screen.getByTestId('forgot-password-form-btn')
  await act(() => forgotPasswordBtn.click())
}

const expectElementToBeInDocument = async (testId: string) => {
  const element = await screen.findByTestId(testId)
  await waitFor(() => expect(element).toBeInTheDocument())
}
const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ForgotPassword', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<ForgotPassword />)
      expect(asFragment()).toMatchSnapshot()
    })
    it('should display initial view', async () => {
      renderWithProviders(<ForgotPassword />)
      await waitFor(() => expectElementToBeInDocument('forgot-password-form'))
    })

    // Loading view not displayed so no test necessary
    // it('should display loading view', async ...)

    it('should display error view', async () => {
      // Assemble
      server.use(
        rest.post(forgotPasswordUrl, (__, res, ctx) => {
          return res(ctx.status(422))
        }),
      )
      renderWithProviders(<ForgotPassword />)
      await setupForm(['email'])

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('forgot-password-form-error'),
      )
    })

    it('should display successful submission message', async () => {
      // Assemble
      renderWithProviders(<ForgotPassword />)
      await setupForm(['email'])

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('forgot-password-form-success'),
      )
    })
  })

  describe('interaction', () => {
    it('should display error when email is invalid', async () => {
      // Assemble
      renderWithProviders(<ForgotPassword />)
      await setupForm([])

      // Act
      await submitForm()

      // Assert
      await waitFor(() =>
        expectElementToBeInDocument('forgot-password-form-email-error'),
      )
    })
  })
})
