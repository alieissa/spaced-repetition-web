/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import { DeckPage } from '..'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const deckId = faker.string.uuid()
const decksUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}`

// Mounting component this way ensures that the route parameter :deckId
// has id of the deck, i.e. deckId defined above
const mountComponent = () =>
  renderWithProviders(<DeckPage />, {
    initialEntries: [`/decks/${deckId}`],
    path: 'decks/:deckId',
  })

const handlers = [
  rest.get(decksUrl, (__, res, ctx) => {
    return res(
      ctx.json({
        id: deckId,
        name: faker.word.noun(),
        cards: [
          {
            id: faker.string.uuid(),
            question: faker.lorem.sentence(5),
            answers: [
              {
                id: faker.string.uuid(),
                content: faker.lorem.sentence(5),
              },
            ],
          },
        ],
      }),
      ctx.status(200),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DeckPage', () => {
  describe('view', () => {
    it('should render correctly', async () => {
      const { asFragment } = mountComponent()
      await act(flushPromises)

      expect(asFragment()).toMatchSnapshot()
    })

    it('should display success', async () => {
      mountComponent()

      await act(flushPromises)

      const testId = 'deck-success'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    it('should display failure', async () => {
      server.use(
        rest.get(decksUrl, (__, res, ctx) => {
          return res(ctx.status(500))
        }),
      )
      mountComponent()

      await act(flushPromises)

      const testId = 'deck-failure'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })
})
