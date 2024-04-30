/** @format */

import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders } from 'src/utils/test-utils'
import DecksUploadModal from '../DecksUploadModal'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

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

  const input = screen.getByTestId(inputElementId)
  expect(input).toBeInTheDocument()

  return user.upload(input, file)
}

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DecksUploadModal', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<DecksUploadModal />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should display loading when upload in progress', async () => {
      // Assemble
      server.use(
        rest.post(decksUploadUrl, async (__, res, ctx) => {
          return res(ctx.status(200), ctx.delay(100))
        }),
      )
      renderWithProviders(<DecksUploadModal />)
      const deckImportBtn = screen.getByTestId('decks-upload-modal-btn')
      await act(() => user.click(deckImportBtn))
      await act(() => uploadFile('decks-upload-file-input'))

      // Act
      const decksUploadConfirmBtn = screen.getByTestId(
        'decks-upload-confirm-btn',
      )
      await act(() => user.click(decksUploadConfirmBtn))

      // Assert
      const decksUploadLoader = screen.queryByTestId('decks-upload-loader')
      expect(decksUploadLoader).toBeInTheDocument()
    })

    it('should display error when upload fails', async () => {
      // Assemble
      server.use(
        rest.post(decksUploadUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      renderWithProviders(<DecksUploadModal />)
      const deckImportBtn = screen.getByTestId('decks-upload-modal-btn')
      await act(() => user.click(deckImportBtn))
      await act(() => uploadFile('decks-upload-file-input'))

      // Act
      const decksUploadConfirmBtn = screen.getByTestId(
        'decks-upload-confirm-btn',
      )
      await act(() => user.click(decksUploadConfirmBtn))

      // Assert
      const decksUploadLoader = screen.queryByTestId('decks-upload-error')
      expect(decksUploadLoader).toBeInTheDocument()
    })

    // There is no success test, because that is an implementation detail
    // and is best suited for e-2-e testing
  })
})
