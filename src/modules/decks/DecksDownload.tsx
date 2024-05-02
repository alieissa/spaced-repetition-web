/** @format */

import { useRef } from 'react'
import 'src/App.css'
import { ExportButton } from '../../components'
/**
 * This contains the download button. Once the button is clicked all the users
 * decks are imported in a file called decks.json
 */
export default function DecksDownload() {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null)

  const handleExportBtnClicked = () => {
    downloadAnchorRef.current?.click()
  }

  return (
    <>
      <ExportButton
        data-testid="decks-download-btn"
        onClick={handleExportBtnClicked}
      />
      <a
        hidden
        download
        ref={downloadAnchorRef}
        // TODO replace with retrieved download url
        href=""
      />
    </>
  )
}
