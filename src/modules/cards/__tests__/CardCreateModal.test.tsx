/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderModalWithProviders } from 'src/utils/test-utils'
import CardCreateModal from '../CardCreateModal'

const deckId = faker.string.uuid()
const cardCreateUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}/cards`

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mountComponent = () =>
  renderModalWithProviders(<CardCreateModal />, {
    initialEntries: [`/decks/${deckId}/cards/new`],
    path: 'decks/:deckId/cards/new',
  })

const fillInForm = async () => {
  const user = userEvent.setup()

  const questionInput = await screen.findByTestId('question-content')
  await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))

  const answerInput = await screen.findByTestId('answer-content-0')
  await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))
}

describe('CardCreateModal', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should display error when card creation fails', async () => {
      // Assemble
      server.use(
        rest.post(cardCreateUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      mountComponent()
      await fillInForm()

      // Act
      const cardCreateSaveBtn = screen.getByTestId('card-create-save-btn')
      await act(() => cardCreateSaveBtn.click())
      await act(flushPromises)

      // Assert
      const cardCreateError = await screen.findByTestId('card-create-error')
      expect(cardCreateError).toBeInTheDocument()
    })
  })
})
