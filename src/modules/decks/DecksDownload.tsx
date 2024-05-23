/* eslint-disable jsx-a11y/anchor-has-content */

import { useEffect, useRef } from 'react'
import 'src/App.css'
import { DownloadButton } from '../../components'
import { useDownloadDecks } from './decks.hooks'
/**
 * This contains the download button. Once the button is clicked all the users
 * decks are imported in a file called decks.json
 */
export default function DecksDownload() {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null)
  const [downloadDecksUrl, downloadDecksStatus, downloadDecks] =
    useDownloadDecks()

  const status = downloadDecksStatus.type
  const isDownloadDecksDisbaled = status === 'Loading' || status === 'Failure'

  useEffect(() => {
    if (status !== 'Success') {
      return
    }
    downloadAnchorRef.current?.click()
  }, [status])

  // TODO display success or failure message component on page wher
  // download button is displayed
  return (
    <>
      <DownloadButton
        data-testid="decks-download-btn"
        disabled={isDownloadDecksDisbaled}
        onClick={downloadDecks}
      />

      {downloadDecksUrl && (
        <a
          hidden
          download
          data-testid="decks-download-anchor"
          ref={downloadAnchorRef}
          href={downloadDecksUrl}
        />
      )}
    </>
  )
}
