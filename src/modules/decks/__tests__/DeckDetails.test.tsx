/** @format */

import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom'

import { flushPromises, withRedux } from 'src/utils/test-utils'
import { DeckDetails, DecksListPage } from '..'

const setupRouter = (routes: RouteObject[], initialEntries: string[]) => {
  const router = createMemoryRouter(routes, { initialEntries })
  return <RouterProvider router={router} />
}
const deckId = faker.string.uuid()
const deckDetailsUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks/${deckId}`
const decksUrl = `${process.env.REACT_APP_API_ENDPOINT}/decks`

// Mounting component this way ensures that the route parameter :deckId
// has id of the deck, i.e. deckId defined above
const mountComponent = () => {
  const initialEntries = ['/decks']
  const routes = [
    { path: '/decks', element: <DecksListPage /> },
    { path: `/decks/:deckId`, element: <DeckDetails /> },
  ]
  return render(withRedux(setupRouter(routes, initialEntries)))
}

const handlers = [
  rest.get(decksUrl, (__, res, ctx) => {
    return res(
      ctx.json([
        {
          id: deckId,
          name: 'Test name5',
          cards: [
            {
              id: 'testUuid',
              question: 'Test question',
              answers: [
                {
                  id: 'testUuid',
                  content: 'Test content',
                },
              ],
            },
          ],
        },
      ]),
      ctx.status(200),
    )
  }),
  rest.get(deckDetailsUrl, (__, res, ctx) => {
    return res(
      ctx.json({
        id: deckId,
        name: 'Test name',
        cards: [
          {
            id: 'testUuid',
            question: 'Test question',
            answers: [
              {
                id: 'testUuid',
                content: 'Test content',
              },
            ],
          },
        ],
      }),
      ctx.status(200),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DeckDetails', () => {
  describe('view', () => {
    it('should render correctly', async () => {
      const { asFragment } = mountComponent()
      await act(flushPromises)

      expect(asFragment()).toMatchSnapshot()
    })

    it('should display success', async () => {
      mountComponent()

      await act(flushPromises)

      const testId = 'deck-details-success'
      expect(await screen.findByTestId(testId)).toBeInTheDocument()
    })

    // The DeckDetails component is not rendered independently of DecksListPage
    // so there is no scenario where a call to /decks/:id is made. The moment we
    // decks list then that is used as source of truth for deck details
    // it.skip('should display failure', ...)
  })

  describe('interaction', () => {
    it('should display popup menu when clicking on hamburger menu', async () => {
      // Assemble
      mountComponent()
      await act(flushPromises)

      // Act
      const deckDetailsMenuBtn = await screen.findByTestId(
        'deck-details-dropdown',
      )
      await act(() => deckDetailsMenuBtn.click())

      // Assert
      const deckDetailsMenu = await screen.findByTestId(
        'deck-details-dropdown-menu',
      )
      expect(deckDetailsMenu).toBeVisible()
    })

    it('should open delete confirmation dialog when clicking on delete option', async () => {
      // Assemble
      mountComponent()
      await act(flushPromises)
      const deckDetailsMenuBtn = await screen.findByTestId(
        'deck-details-dropdown',
      )
      await act(() => deckDetailsMenuBtn.click())

      // Act
      const deckMenuDeleteOption = await screen.findByTestId(
        'deck-menu-delete-option',
      )
      await act(() => deckMenuDeleteOption.click())

      // Assert
      const deckDeleteConfirmation = await screen.findByTestId(
        'deck-delete-confirmation-dialog',
      )
      expect(deckDeleteConfirmation).toBeVisible()
    })

    it('should display nothing when decks list is empty', async () => {
      // Assemble
      server.use(
        rest.get(decksUrl, (__, res, ctx) => {
          return res(ctx.json([]), ctx.status(200))
        }),
      )
      mountComponent()

      // Assert
      const deckDetailsComponent = screen.queryByTestId('deck-details')
      expect(deckDetailsComponent).not.toBeInTheDocument()
    })
  })
})
