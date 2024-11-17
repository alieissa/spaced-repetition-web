/* eslint-disable jsx-a11y/anchor-has-content */

import { useEffect, useRef } from 'react'
import 'src/App.css'
import { DownloadButton } from '../../components'
import { useDownloadDecksQuery } from './decks.hooks'
/**
 * This contains the download button. Once the button is clicked all the users
 * decks are imported in a file called decks.json
 */
export default function DecksDownload() {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null)
  const { status, data, refetch } = useDownloadDecksQuery()

  const isDownloadDecksDisbaled = status === 'loading' || status === 'error'
  const downloadHref = status === 'success' ? data.data : ''

  useEffect(() => {
    if (status === 'success') {
      downloadAnchorRef.current?.click()
    }
  }, [status])

  // https://github.com/TanStack/query/discussions/1205
  const downloadDecks = () => {
    refetch()
  }

  return (
    <>
      <DownloadButton
        data-testid="decks-download-btn"
        disabled={isDownloadDecksDisbaled}
        onClick={downloadDecks}
      />

      {status === 'success' && (
        <a
          hidden
          download
          data-testid="decks-download-anchor"
          ref={downloadAnchorRef}
          href={downloadHref}
        />
      )}
    </>
  )
}
