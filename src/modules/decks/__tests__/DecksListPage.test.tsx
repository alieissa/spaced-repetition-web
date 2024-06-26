/** @format */

import '@testing-library/jest-dom'
import {
  act,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import { DecksListPage } from '..'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const decksUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks`

export const handlers = [
  rest.get(decksUrl, (__, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 'testDeck0id',
          name: 'Test Deck',
          card: [
            {
              id: 'testCard0id',
              question: 'Test Question',
              answers: [
                {
                  id: 'testAnswer0id',
                  content: 'Test Answer',
                },
              ],
            },
          ],
        },
      ]),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DecksListPage', () => {
  describe('view', () => {
    it('should render correctly', async () => {
      const { asFragment } = renderWithProviders(<DecksListPage />)
      await act(flushPromises)

      expect(asFragment()).toMatchSnapshot()
    })
    it('should display loading', async () => {
      renderWithProviders(<DecksListPage />)

      const testId = 'decks-list-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    it('should display failure', async () => {
      server.use(rest.get(decksUrl, (__, res, ctx) => res(ctx.status(402))))

      renderWithProviders(<DecksListPage />)

      await act(flushPromises)

      const testId = 'decks-list-failure'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    it('should display success', async () => {
      renderWithProviders(<DecksListPage />)

      await act(flushPromises)

      const testId = 'decks-list-success'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })

  // TODO: Unstable test. Will address it in another ticket
  describe('interaction', () => {
    it.skip('should navigate to login on 401', async () => {
      server.use(rest.get(decksUrl, (__, res, ctx) => res(ctx.status(401))))

      renderWithProviders(<DecksListPage />)

      await act(flushPromises)

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('should navigate to first deck when decks', async () => {
      // Assemble
      renderWithProviders(<DecksListPage />)

      // Assert
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith('testDeck0id'),
      )
    })

    it('should NOT attempt to navigate to first deck when decks list is empty', async () => {
      // Assemble
      server.use(rest.get(decksUrl, (__, res, ctx) => res(ctx.json([]))))
      renderWithProviders(<DecksListPage />)
      await act(flushPromises)

      // Assert
      expect(mockNavigate).not.toHaveBeenCalledWith()
    })
  })
})
