/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderModalWithProviders } from 'src/utils/test-utils'
import DeckDeleteConfirmationDialog from '../DeckDeleteConfirmationDialog'

const deckId = faker.string.uuid()
const deckDeleteUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}/cards`

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mountComponent = () =>
  renderModalWithProviders(<DeckDeleteConfirmationDialog open={true} />, {
    initialEntries: [`/decks/${deckId}/cards/new`],
    path: 'decks/:deckId/cards/new',
  })

describe('DeckDeleteConfirmationDialog', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should display error when deck deletion fails', async () => {
      // Assemble
      server.use(
        rest.post(deckDeleteUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      mountComponent()

      // Act
      const deckDeleteConfirmBtn = screen.getByTestId('deck-delete-confirm-btn')
      await act(() => deckDeleteConfirmBtn.click())
      await act(flushPromises)

      // Assert
      const cardCreateError = await screen.findByTestId('deck-delete-error')
      expect(cardCreateError).toBeInTheDocument()
    })
  })
})
