/** @format */

import { ChangeEvent, useRef } from 'react'
import { Button } from 'semantic-ui-react'

type Props = {
  onFileSelected: (file: ChangeEvent<HTMLInputElement>) => void
}
export default function FileSelector(props: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        content="Select File"
        labelPosition="left"
        icon="file"
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={props.onFileSelected}
      />
    </>
  )
}
