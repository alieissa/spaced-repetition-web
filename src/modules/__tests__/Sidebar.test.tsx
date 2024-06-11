/** @format */

import '@testing-library/jest-dom'
import { act, screen, waitFor } from '@testing-library/react'
import { RestContext, rest } from 'msw'
import { setupServer } from 'msw/node'
import { flushPromises, renderWithProviders } from 'src/utils/test-utils'
import Sidebar from '../Sidebar'
const mockNavigate = jest.fn(() => ({}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const logoutUrl = `${process.env.REACT_APP_API_ENDPOINT}/users/logout`

export const handlers = [
  rest.get(logoutUrl, (__, res, ctx) => {
    return res(ctx.status(200))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Sidebar', () => {
  describe('view', () => {
    it('should render correctly', async () => {
      const { asFragment } = renderWithProviders(<Sidebar />)
      await act(flushPromises)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it.each([
      ['loading', (ctx: RestContext) => [ctx.status(200), ctx.delay(100)]],
      ['failed', (ctx: RestContext) => [ctx.status(422)]],
      ['success', (ctx: RestContext) => [ctx.status(200)]],
    ])(
      'should navigate to login when logout call is %s',
      async (_, apiMockReturn) => {
        // Assemble
        server.use(
          rest.get(logoutUrl, (__, res, ctx) => res(...apiMockReturn(ctx))),
        )
        renderWithProviders(<Sidebar />)

        // Act
        const logoutMenuItem = screen.getByTestId('sidebar-logout-menu-item')
        await act(() => logoutMenuItem.click())

        // Assert
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
      },
    )
  })
})
