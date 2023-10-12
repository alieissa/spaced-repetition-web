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
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      const testId = 'signup-form-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
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

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      const testId = 'signup-form-error'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    test('display success', async () => {
      renderWithProviders(<Signup />)

      const user = userEvent.setup()
      const emailInput = screen.getByRole('textbox', { name: 'email' })
      const passwordInput = screen.getByTitle('password')
      await act(() => user.type(emailInput, 'johnnyb1@gmail.com'))
      await act(() => user.type(passwordInput, 'heythere!'))

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      const testId = 'signup-form-successful'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })
})
