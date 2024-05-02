/** @format */

import { Button, ButtonProps } from 'semantic-ui-react'
import './components.css'

export default function ExportButton(props: ButtonProps) {
  return (
    <Button size="small" className="import-btn" icon="download" {...props} />
  )
}
