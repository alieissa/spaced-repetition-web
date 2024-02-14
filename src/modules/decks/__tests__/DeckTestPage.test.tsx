/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import userEvent from '@testing-library/user-event'
import _ from 'lodash'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import { DeckTestPage } from '..'
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
  renderWithProviders(<DeckTestPage />, {
    initialEntries: [`/decks/${deckId}/test`],
    path: 'decks/:deckId/test',
  })

const createCardHandler = (numCards: number = 1) => {
  const createCard = (index: number) => ({
    id: index,
    question: faker.lorem.sentence(5),
    answers: [
      {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(5),
      },
    ],
  })

  return rest.get(decksUrl, (__, res, ctx) => {
    return res(
      ctx.json({
        id: deckId,
        name: faker.word.noun(),
        cards: _.times(numCards, createCard),
      }),
      ctx.status(200),
    )
  })
}
const handlers = [createCardHandler(1)]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DeckTestPage', () => {
  const user = userEvent.setup()

  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()
      expect(asFragment()).toMatchSnapshot()
    })

    it('should display loading', async () => {
      mountComponent()
      const testId = 'deck-test-loading'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
      // See https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      await waitForElementToBeRemoved(() => screen.queryByTestId(testId))
    })

    it('should display success', async () => {
      mountComponent()

      await act(flushPromises)

      const testId = 'deck-test-success'
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

      const testId = 'deck-test-failure'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('should not display navigation arrows for deck with one card', async () => {
      // Assemble
      server.use(createCardHandler(1))
      mountComponent()
      await act(flushPromises)

      // Assert
      const nextCardBtn = screen.queryByTestId('next-card-btn')
      const previousCardBtn = screen.queryByTestId('previous-card-btn')
      expect(nextCardBtn).not.toBeInTheDocument()
      expect(previousCardBtn).not.toBeInTheDocument()
    })

    it('should disable next on last card', async () => {
      // Assemble
      server.use(createCardHandler(4))
      mountComponent()
      await act(flushPromises)

      // Act
      const nextCardBtn = screen.getByTestId('next-card-btn')
      await act(() => user.click(nextCardBtn))
      await act(() => user.click(nextCardBtn))
      await act(() => user.click(nextCardBtn))

      // Assert
      expect(await screen.findByTestId('test-card-3')).toBeInTheDocument()
      expect(nextCardBtn).toHaveAttribute('disabled')
    })

    it('should disable previous on first card', async () => {
      // Assemble
      server.use(createCardHandler(4))
      mountComponent()
      await act(flushPromises)

      // Act
      const previousCardBtn = screen.getByTestId('previous-card-btn')
      const nextCardBtn = screen.getByTestId('next-card-btn')
      await act(() => user.click(nextCardBtn))
      await act(() => user.click(previousCardBtn))

      // Assert
      expect(await screen.findByTestId('test-card-0')).toBeInTheDocument()
      expect(previousCardBtn).toHaveAttribute('disabled')
    })
  })
})
