/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { renderWithProviders } from 'src/utils/test-utils'
import CardCreateModal from '../CardCreateModal.1'

const deckId = faker.string.uuid()
const cardCreateUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}/cards`

export const handlers = [
  rest.post(cardCreateUrl, async (__, res, ctx) => {
    return res(ctx.status(200), ctx.delay(100))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('CardCreateModal', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(
        <CardCreateModal deckId={deckId} />,
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should display error when card creation fails', async () => {
      // Assemble
      server.use(
        rest.post(cardCreateUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      renderWithProviders(<CardCreateModal deckId={deckId} />)
      const deckImportBtn = screen.getByTestId('card-create-modal-btn')
      await act(() => deckImportBtn.click())

      // Act
      const cardCreateSaveBtn = screen.getByTestId('card-create-save-btn')
      await act(() => cardCreateSaveBtn.click())

      // Assert
      const cardCreateError = await screen.findByTestId('card-create-error')
      expect(cardCreateError).toBeInTheDocument()
    })
  })
})
