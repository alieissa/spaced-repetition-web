/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { renderWithProviders } from 'src/utils/test-utils'
import CardDetails from '../CardDetails'
import { NCards } from '../cards.types'

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

describe('CardDetails', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(
        <CardDetails {...NCards.Initial({})} />,
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    describe('CardDetailsView', () => {
      it('should display card form when clicking on edit button', async () => {
        // Assemble
        renderWithProviders(<CardDetails {...NCards.Initial({})} />)

        // Act
        const cardDetailsEditBtn = screen.getByTestId('card-details-edit-btn')
        await act(() => user.click(cardDetailsEditBtn))

        // Assert
        const cardDetailsEditForm = screen.queryByTestId('card-details-form')
        expect(cardDetailsEditForm).toBeInTheDocument()
      })

      it('should display answers of question when eye icon is clicked', async () => {
        // Assemble
        renderWithProviders(<CardDetails {...NCards.Initial({})} />)

        // Act
        const viewAnswersBtn = screen.getByTestId('view-answers-btn')
        await act(() => user.click(viewAnswersBtn))

        // Assert
        const answer = screen.queryByTestId('answers-0')
        expect(answer).toBeInTheDocument()
      })
    })
  })
})
