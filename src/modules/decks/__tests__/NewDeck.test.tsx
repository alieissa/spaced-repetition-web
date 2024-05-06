/** @format */

import '@testing-library/jest-dom'

import { renderWithProviders } from 'src/utils/test-utils'
import { NewDeck } from '..'

describe('NewDeck', () => {
  describe('view', () => {
    it('should render correctly', () => {
      const { asFragment } = renderWithProviders(<NewDeck />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
