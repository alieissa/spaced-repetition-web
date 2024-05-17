/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import DecksDownload from '../DecksDownload'

const decksDownloadUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/download`

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DecksDownload', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<DecksDownload />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should disable download button when downloading', async () => {
      // Assemble
      server.use(
        rest.get(decksDownloadUrl, async (__, res, ctx) => {
          return res(ctx.status(200), ctx.delay(100))
        }),
      )
      renderWithProviders(<DecksDownload />)
      const decksDownloadBtn = await screen.findByTestId('decks-download-btn')

      // Act
      await act(() => decksDownloadBtn.click())

      // Assert
      expect(decksDownloadBtn).toBeDisabled()
    })

    it('should disable download button when download failed', async () => {
      // Assemble
      server.use(
        rest.get(decksDownloadUrl, (__, res, ctx) => res(ctx.status(422))),
      )
      renderWithProviders(<DecksDownload />)
      const decksDownloadBtn = await screen.findByTestId('decks-download-btn')

      // Act
      await act(() => decksDownloadBtn.click())
      await act(flushPromises)

      // Assert
      expect(decksDownloadBtn).toBeDisabled()
    })

    it('should add download url to download anchor', async () => {
      // Assemble
      const anchorHref = faker.internet.url()
      server.use(
        rest.get(decksDownloadUrl, async (__, res, ctx) => {
          return res(ctx.status(200), ctx.text(anchorHref))
        }),
      )
      renderWithProviders(<DecksDownload />)
      const decksDownloadBtn = await screen.findByTestId('decks-download-btn')

      // Act
      await act(() => decksDownloadBtn.click())
      await act(flushPromises)

      // Assert
      const decksDownloadAnchor = screen.getByTestId('decks-download-anchor')
      expect(decksDownloadAnchor).toHaveAttribute('href', anchorHref)
    })
  })
})
