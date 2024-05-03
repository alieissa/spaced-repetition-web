/** @format */

import { Button, ButtonProps } from 'semantic-ui-react'
import './components.css'

export default function ExportButton(props: ButtonProps) {
  return (
    <Button size="small" className="export-btn" icon="download" {...props} />
  )
}
