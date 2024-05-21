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

const mountComponent = (
  status: async.Async<null, RequestError, null> = async.Untriggered(),
) =>
  renderWithProviders(
    <DeckForm
      deck={NDecks.Initial({})}
      submitStatus={status}
      successMessage="Form successfully submitted"
      failureMessage="Failed to submit form"
      onSubmit={_.noop}
      onCancel={_.noop}
    />,
  )

const fillInForm = async (
  testIds: (
    | 'deck-name'
    | 'deck-description'
    | 'question-content'
    | 'answer-content-0'
  )[] = [
    'deck-name',
    'deck-description',
    'question-content',
    'answer-content-0',
  ],
) => {
  const user = userEvent.setup()

  if (testIds.includes('deck-name')) {
    const nameInput = await screen.findByTestId('deck-name')
    await act(() => user.type(nameInput as Element, faker.lorem.lines(1)))
  }

  if (testIds.includes('deck-description')) {
    const descriptionInput = await screen.findByTestId('deck-description')
    await act(() =>
      user.type(descriptionInput as Element, faker.lorem.lines(1)),
    )
  }

  if (testIds.includes('question-content')) {
    const questionInput = await screen.findByTestId('question-content')
    await act(() => user.type(questionInput as Element, faker.lorem.lines(1)))
  }

  if (testIds.includes('answer-content-0')) {
    const answerInput = await screen.findByTestId('answer-content-0')
    await act(() => user.type(answerInput as Element, faker.lorem.lines(1)))
  }
}

const submitForm = async () => {
  const saveButton = await screen.findByTestId('deck-save')
  await act(() => saveButton.click())
  await act(flushPromises)
}

describe('DeckForm', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = mountComponent()
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should create deck', async () => {
      // Assemble
      mountComponent(async.Success(null))
      await fillInForm()

      // Act
      await submitForm()

      // Assert
      const successMessage = screen.queryByTestId('deck-submission-success')
      expect(successMessage).toBeInTheDocument()
    })

    it('shoudl display failure message when submission fails', async () => {
      // Assemble
      mountComponent(async.Failure({ message: faker.word.sample() }))
      await fillInForm()

      // Act
      await submitForm()

      // Assert
      const warningMessage = await screen.findByTestId(
        'deck-submission-failure',
      )
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow submission with empty deck name', async () => {
      // Assemble
      mountComponent()
      await fillInForm(['deck-description'])

      // Act
      await submitForm()

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow submission with empty question content', async () => {
      // Assemble
      const user = userEvent.setup()
      mountComponent()
      await fillInForm(['deck-name', 'answer-content-0'])

      // Act
      await submitForm()

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should not allow saving deck with empty answer content', async () => {
      // Assemble
      mountComponent()
      await fillInForm(['deck-name', 'question-content'])

      // Act
      await submitForm()

      // Assert
      const warningMessage = await screen.findByTestId('deck-submission-error')
      expect(warningMessage).toBeInTheDocument()
    })

    it('should disable submit button when submission in progress', async () => {
      // Assemble
      mountComponent(async.Loading(null))
      await fillInForm()

      // Act
      await submitForm()

      // Assert
      const saveButton = await screen.findByTestId('deck-save')
      expect(saveButton).toBeDisabled()
    })
  })
})
