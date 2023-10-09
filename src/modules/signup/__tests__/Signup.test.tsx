/** @format */

import '@testing-library/jest-dom'
import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
import Signup from '../Signup'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const signupUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/register`

export const handlers = [
  rest.post(signupUrl, (__, res, ctx) => {
    return res(
      ctx.json({ email: 'jonhnybravo1@gmail.com', password: 'heythere!' }),
    )
  }),
]

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
  })

  describe('interaction', () => {
    test('display initial', async () => {
      renderWithProviders(<Signup />)
      expect(screen.getByTestId('signup-form')).toBeInTheDocument()
    })

    test('display loading', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Signup />)

      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      await act(() =>
        fireEvent.click(screen.getByRole('button', { name: 'Submit' })),
      )

      expect(screen.getByTestId('signup-form-loading')).toBeInTheDocument()
    })

    test('display failure', async () => {
      server.use(
        rest.post(signupUrl, (__, res, ctx) =>
          res(ctx.json({ email: 'dfsfsdf' }), ctx.status(422)),
        ),
      )

      renderWithProviders(<Signup />)

      const user = userEvent.setup()
      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      await act(() =>
        fireEvent.click(screen.getByRole('button', { name: 'Submit' })),
      )

      // Make sure all the state updates have been performed
      await act(flushPromises)

      expect(screen.getByTestId('signup-form-error')).toBeInTheDocument()
    })

    test('display success', async () => {
      renderWithProviders(<Signup />)

      const user = userEvent.setup()
      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      await act(() =>
        fireEvent.click(screen.getByRole('button', { name: 'Submit' })),
      )

      // Make sure all the state updates have been performed
      await act(flushPromises)

      expect(screen.getByTestId('signup-form-successful')).toBeInTheDocument()
    })
  })
})
