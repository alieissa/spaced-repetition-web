/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import _ from 'lodash'
import { RequestError } from 'src/types'
import { async } from 'src/utils'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import { NDecks } from '../../decks.types'
import DeckForm from '../DeckForm'

describe('DeckForm', () => {
  const mountComponent = (
    status: async.Async<null, RequestError, null> = async.Untriggered(),
  ) =>
    renderWithProviders(
      <DeckForm
        header="Test Deck"
        deck={NDecks.Initial({})}
        submitStatus={status}
        successMessage="Form successfully submitted"
        failureMessage="Failed to submit form"
        onSubmit={_.noop}
        onCancel={_.noop}
      />,
    )
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should create deck', () => {
      // Assemble
      mountComponent(async.Success(null))

      // Assert
      const successMessage = screen.queryByTestId('deck-submission-success')
      expect(successMessage).toBeInTheDocument()
    })

    it('shoudl display failure message when submission fails', () => {
      // Assemble
      mountComponent(async.Failure({ message: faker.word.sample() }))

      // Assert
      const warningMessage = screen.queryByTestId('deck-submission-failure')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow submission with empty deck name', async () => {
      // Assemble
      mountComponent()
      const user = userEvent.setup()
      const descriptionInput = await screen.findByTestId('deck-description')

      // Act
      await act(() =>
        user.type(descriptionInput as Element, faker.lorem.lines(1)),
      )
      const saveButton = await screen.findByTestId('deck-save')
      await act(() => saveButton.click())

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow submission with empty question content', async () => {
      // Assemble
      const user = userEvent.setup()
      mountComponent()
      const nameInput = await screen.findByTestId('deck-name')
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const viewAnswersBtn = await screen.findByTestId('view-answers-btn')
      await act(() => viewAnswersBtn.click())

      const answerInput = await screen.findByTestId('answer-content-0')
      await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = await screen.findByTestId('deck-save')
      await act(() => saveButton.click())
      await act(flushPromises)

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow saving deck with empty answer content', async () => {
      // Assemble
      const user = userEvent.setup()
      mountComponent()

      const nameInput = await screen.findByTestId('deck-name')
      await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))

      const questionInput = await screen.findByTestId('question-content')
      await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))

      // Act
      const saveButton = await screen.findByTestId('deck-save')
      await act(() => saveButton.click())
      await act(flushPromises)

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should disable submit button when submission in progress', async () => {
      // Assemble
      mountComponent(async.Loading(null))

      // Assert
      const saveButton = await screen.findByTestId('deck-save')
      expect(saveButton).toBeDisabled()
    })
  })
})
