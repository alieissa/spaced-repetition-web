/** @format */

import { useEffect, useRef } from 'react'
import 'src/App.css'
import { ExportButton } from '../../components'
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

  // TODO display success or failure message in a popover.
  // To do that must first create a popover component
  return (
    <>
      <ExportButton
        data-testid="decks-download-btn"
        disabled={isDownloadDecksDisbaled}
        onClick={downloadDecks}
      />

      {downloadDecksUrl && (
        <a hidden download ref={downloadAnchorRef} href={downloadDecksUrl} />
      )}
    </>
  )
}
