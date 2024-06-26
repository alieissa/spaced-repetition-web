/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderModalWithProviders } from 'src/utils/test-utils'
import CardDetailsModal from '../CardDetailsModal'

const deckId = faker.string.uuid()
const cardId = faker.string.uuid()
const cardUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}/cards/${cardId}`

export const handlers = [
  rest.get(cardUrl, async (__, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: cardId,
        question: faker.word.words(2),
        answers: [{ id: faker.string.uuid(), content: faker.word.words(5) }],
      }),
    )
  }),
  rest.put(cardUrl, async (__, res, ctx) => {
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
  renderModalWithProviders(<CardDetailsModal />, {
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
        const cardDetailsModalEditBtn = await screen.findByTestId(
          'card-details-edit-btn',
        )
        await act(() => cardDetailsModalEditBtn.click())

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
        await act(() => viewAnswersBtn.click())

        // Assert
        const answer = screen.queryByTestId('answers-0')
        expect(answer).toBeInTheDocument()
      })
    })

    describe('CardDetailsForm', () => {
      it('should display card detail when clicking on back button', async () => {
        // Assemble
        mountComponent()
        await act(flushPromises)
        const cardDetailsModalEditBtn = await screen.findByTestId(
          'card-details-edit-btn',
        )
        await act(() => cardDetailsModalEditBtn.click())

        // Act
        const cardDetailsFormBackBTn = await screen.findByTestId(
          'card-details-form-back-btn',
        )
        await act(() => cardDetailsFormBackBTn.click())

        // Assert
        const cardDetailsView = await screen.findByTestId('card-details-view')
        expect(cardDetailsView).toBeInTheDocument()
      })

      it('should display an error message when update fails', async () => {
        // Assemble
        server.use(
          rest.put(cardUrl, async (__, res, ctx) => {
            return res(ctx.status(422))
          }),
        )
        mountComponent()
        await act(flushPromises)
        const cardDetailsModalEditBtn = await screen.findByTestId(
          'card-details-edit-btn',
        )
        await act(() => cardDetailsModalEditBtn.click())

        // Act
        const saveBtn = await screen.findByTestId('card-details-form-save-btn')
        await act(() => saveBtn.click())
        await act(flushPromises)

        // Assert
        const cardSaveError = await screen.findByTestId('card-update-error')
        expect(cardSaveError).toBeInTheDocument()
      })
    })
  })
})
