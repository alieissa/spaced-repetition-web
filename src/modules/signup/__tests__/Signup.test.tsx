/** @format */

import '@testing-library/jest-dom'
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import _ from 'lodash'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
import Signup from '../Signup'

const signupUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/register`

export const handlers = [
  rest.post(signupUrl, (__, res, ctx) => {
    return res(
      ctx.json({ email: 'jonhnybravo1@gmail.com', password: 'heythere!' }),
    )
  }),
]

const formFields = [
  'firstName',
  'lastName',
  'email',
  'password',
  'confirmedPassword',
] as const

const setupForm = async (fields: (typeof formFields)[number][]) => {
  const user = userEvent.setup()
  if (fields.includes('firstName')) {
    const firstNameInput = screen.getByTestId('signup-form-first-name-input')
    await act(() => user.type(firstNameInput, 'Johnny'))
  }

  if (fields.includes('lastName')) {
    const lastNameInput = screen.getByTestId('signup-form-last-name-input')
    await act(() => user.type(lastNameInput, 'Bravo'))
  }

  if (fields.includes('email')) {
    const emailInput = screen.getByTestId('signup-form-email-input')
    await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
  }

  if (fields.includes('password')) {
    const passwordInput = screen.getByTestId('signup-form-password-input')
    await act(() => user.type(passwordInput, 'heythere!'))
  }

  if (fields.includes('confirmedPassword')) {
    const confirmedPasswordInput = screen.getByTestId(
      'signup-form-confirmed-password-input',
    )
    await act(() => user.type(confirmedPasswordInput, 'heythere!'))
  }
}

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Signup', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<Signup />)
      expect(asFragment()).toMatchSnapshot()
    })

    test('display loading', async () => {
      // Assemble
      renderWithProviders(<Signup />)
      await setupForm([...formFields])

      const signupBtn = screen.getByRole('button', { name: 'Submit' })
      await act(() => signupBtn.click())

      // Assert
      const testId = 'signup-form-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    test('display failure', async () => {
      // Assemble
      server.use(
        rest.post(signupUrl, (__, res, ctx) =>
          res(ctx.json({ email: 'dfsfsdf' }), ctx.status(422)),
        ),
      )
      renderWithProviders(<Signup />)
      await setupForm([...formFields])

      // Act
      const signupBtn = screen.getByRole('button', { name: 'Submit' })
      await act(() => signupBtn.click())

      // Assert
      const testId = 'signup-form-error'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    test('display success', async () => {
      // Assemble
      renderWithProviders(<Signup />)
      await setupForm([...formFields])

      // Act
      const signupBtn = screen.getByRole('button', { name: 'Submit' })
      await act(() => signupBtn.click())

      // Assert
      const testId = 'signup-form-successful'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it.each([
      [
        'Should display error when email is invalid',
        'email',
        'signup-form-email-error',
      ],
      [
        'Should display error when password is invalid',
        'password',
        'signup-form-password-error',
      ],
      [
        'Should display error when confirmed password is invalid',
        'confirmedPassword',
        'signup-form-confirmed-password-error',
      ],
    ])('%s', async (__, omittedFormField, testId) => {
      // Assembled
      renderWithProviders(<Signup />)
      await setupForm(
        _.filter(formFields, (field) => field !== omittedFormField),
      )

      // Act
      const submitBtn = screen.getByRole('button', { name: 'Submit' })
      await act(() => submitBtn.click())

      // Assert
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })
})
