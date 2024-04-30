/** @format */

import _ from 'lodash'
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
        data-testid="file-selector"
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        hidden
        type="file"
        ref={fileInputRef}
        onChange={props.onFileSelected}
        {..._.omit(props, 'onFileSelected')}
      />
    </>
  )
}
