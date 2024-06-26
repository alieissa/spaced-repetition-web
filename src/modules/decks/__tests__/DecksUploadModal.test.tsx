/** @format */

import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderModalWithProviders } from 'src/utils/test-utils'
import DecksUploadModal from '../DecksUploadModal'

const decksUploadUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/upload`

export const handlers = [
  rest.post(decksUploadUrl, async (__, res, ctx) => {
    return res(ctx.status(200), ctx.delay(100))
  }),
]

const uploadFile = async (inputElementId: string) => {
  const blob = new Blob(['dsfasadfdsa'])
  const file = new File([blob], 'test.json', {
    type: 'application/json',
  })

  const input = await screen.findByTestId(inputElementId)
  expect(input).toBeInTheDocument()

  return user.upload(input, file)
}

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DecksUploadModal', () => {
  describe('view', () => {
    it('should render correctly', async () => {
      const { asFragment } = renderModalWithProviders(<DecksUploadModal />)
      const modalBtn = await screen.findByTestId('decks-upload-modal-btn')
      await act(() => modalBtn.click())
      await act(flushPromises)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    // The FormData in the browser and Nodejs are different so this test
    // requires that we either install a browser mock or mock the call api.upload
    // function. Neither of these are attractive options. Will keep the test in
    // case we do e-2-e tesing.
    it.skip('should display loading when upload in progress', async () => {
      // Assemble
      renderModalWithProviders(<DecksUploadModal />)
      const deckImportBtn = await screen.findByTestId('decks-upload-modal-btn')
      await act(() => deckImportBtn.click())
      await act(() => uploadFile('decks-upload-file-input'))

      // Act
      const decksUploadConfirmBtn = await screen.findByTestId(
        'decks-upload-confirm-btn',
      )
      await act(() => decksUploadConfirmBtn.click())

      // Assert
      const decksUploadLoader = screen.queryByTestId('decks-upload-loader')
      expect(decksUploadLoader).toBeInTheDocument()
    })

    it('should display error when upload fails', async () => {
      // Assemble
      server.use(
        rest.post(decksUploadUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      renderModalWithProviders(<DecksUploadModal />)
      const deckImportBtn = await screen.findByTestId('decks-upload-modal-btn')
      await act(() => deckImportBtn.click())
      await act(() => uploadFile('decks-upload-file-input'))

      // Act
      const decksUploadConfirmBtn = await screen.findByTestId(
        'decks-upload-confirm-btn',
      )
      await act(() => decksUploadConfirmBtn.click())

      // Assert
      const decksUploadLoader = screen.queryByTestId('decks-upload-error')
      expect(decksUploadLoader).toBeInTheDocument()
    })

    // There is no success test, because that is an implementation detail
    // and is best suited for e-2-e testing
  })
})
