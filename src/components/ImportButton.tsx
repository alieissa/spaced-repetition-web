/** @format */

import { Button, ButtonProps } from 'semantic-ui-react'
import './components.css'

export default function ImportButton(props: ButtonProps) {
  return <Button size="small" className="import-btn" icon="upload" {...props} />
}