/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import CardDetailsModal from '../CardDetailsModal'

const deckId = faker.string.uuid()
const cardId = faker.string.uuid()
const loadCardUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}/cards/${cardId}`

export const handlers = [
  rest.get(loadCardUrl, async (__, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: cardId,
        question: faker.word.words(2),
        answers: [{ id: faker.string.uuid(), content: faker.word.words(5) }],
      }),
    )
  }),
]

// Mounting component this way ensures that the route parameter :deckId
// has id of the deck, i.e. deckId defined above
const mountComponent = () =>
  renderWithProviders(<CardDetailsModal />, {
    initialEntries: [`/decks/${deckId}/cards/${cardId}`],
    path: 'decks/:deckId/cards/:cardId',
  })

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('CardDetailsModal', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    describe('CardDetailsView', () => {
      it('should display card form when clicking on edit button', async () => {
        // Assemble
        mountComponent()
        await act(flushPromises)

        // Act
        const cardDetailsModalEditBtn = screen.getByTestId(
          'card-details-edit-btn',
        )
        await act(() => user.click(cardDetailsModalEditBtn))

        // Assert
        const cardDetailsForm = await screen.findByTestId('card-details-form')
        expect(cardDetailsForm).toBeInTheDocument()
      })

      it('should display answers of question when eye icon is clicked', async () => {
        // Assemble
        mountComponent()
        await act(flushPromises)

        // Act
        const viewAnswersBtn = await screen.findByTestId('view-answers-btn')
        await act(() => user.click(viewAnswersBtn))

        // Assert
        const answer = screen.queryByTestId('answers-0')
        expect(answer).toBeInTheDocument()
      })
    })
  })
})
