/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import { NewDeck } from '..'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const decksUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks`

export const handlers = [
  rest.post(decksUrl, (__, res, ctx) => {
    return res(ctx.json([]), ctx.status(200))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('NewDeck', () => {
  describe('view', () => {
    it.skip('should render correctly', () => {
      const { asFragment } = renderWithProviders(<NewDeck />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should create deck', async () => {
      // Assemble
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NewDeck />)

      const nameInput = container.querySelector(
        '[data-testid="deck-name"] input',
      )
      expect(nameInput).not.toBeNull()
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const questionInput = container.querySelector(
        '[data-testid="question-content-0"] input',
      )
      expect(questionInput).not.toBeNull()
      await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))

      const answerInput = container.querySelector(
        '[data-testid="answer-content-0"] input',
      )
      expect(answerInput).not.toBeNull()
      await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = screen.getByTestId('deck-save')
      await act(() => user.click(saveButton))

      await act(flushPromises)

      // Assert
      const successMessage = await screen.queryByTestId(
        'deck-submission-success',
      )
      expect(successMessage).toBeInTheDocument()
    })

    it('shoudl display failure message when create deck fails', async () => {
      // Assemble
      server.use(
        rest.post(decksUrl, (__, res, ctx) =>
          res(ctx.json([]), ctx.status(422)),
        ),
      )
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NewDeck />)

      const nameInput = container.querySelector(
        '[data-testid="deck-name"] input',
      )
      expect(nameInput).not.toBeNull()
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const questionInput = container.querySelector(
        '[data-testid="question-content-0"] input',
      )
      expect(questionInput).not.toBeNull()
      await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))

      const answerInput = container.querySelector(
        '[data-testid="answer-content-0"] input',
      )
      expect(answerInput).not.toBeNull()
      await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = screen.getByTestId('deck-save')
      await act(() => user.click(saveButton))

      await act(flushPromises)

      // Assert
      const warningMessage = await screen.queryByTestId(
        'deck-submission-failure',
      )
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow saving deck with empty name', async () => {
      // Assemble
      const { container } = renderWithProviders(<NewDeck />)
      const user = userEvent.setup()
      const descriptionInput = container.querySelector(
        '[data-testid="deck-description"] input',
      )
      expect(descriptionInput).not.toBeNull()

      // Act
      await act(() =>
        user.type(descriptionInput as Element, faker.lorem.lines(1)),
      )
      const saveButton = screen.getByTestId('deck-save')
      await act(() => user.click(saveButton))

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow saving deck with empty question content', async () => {
      // Assemble
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NewDeck />)

      const nameInput = container.querySelector(
        '[data-testid="deck-name"] input',
      )
      expect(nameInput).not.toBeNull()
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const answerInput = container.querySelector(
        '[data-testid="answer-content-0"] input',
      )
      expect(answerInput).not.toBeNull()
      await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = screen.getByTestId('deck-save')
      await act(() => user.click(saveButton))

      await act(flushPromises)

      // Assert
      const warningMessage = await screen.queryByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow saving deck with empty answer content', async () => {
      // Assemble
      const user = userEvent.setup()
      const { container } = renderWithProviders(<NewDeck />)

      const nameInput = container.querySelector(
        '[data-testid="deck-name"] input',
      )
      expect(nameInput).not.toBeNull()
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const questionInput = container.querySelector(
        '[data-testid="question-content-0"] input',
      )
      expect(questionInput).not.toBeNull()
      await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = screen.getByTestId('deck-save')
      await act(() => user.click(saveButton))

      await act(flushPromises)

      // Assert
      const warningMessage = await screen.queryByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })
  })
})
