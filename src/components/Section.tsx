/** @format */

import { HTMLAttributes, PropsWithChildren } from 'react'
import SPHeader from './Header'

const styles = {
  boxShadow: 'none',
  border: '1px solid',
  borderRadius: 'unset',
}
type Props = {
  title: string
  navIcon?: JSX.Element
  actions?: JSX.Element
} & HTMLAttributes<HTMLDivElement>

export default function SPSection(props: PropsWithChildren<Props>) {
  return (
    <div {...props} className="flex-column" style={{ marginTop: '1.5rem' }}>
      <SPHeader size="small" style={{ marginBottom: '0.5rem' }}>
        {props.title}
      </SPHeader>
      <div>{props.children}</div>
    </div>
  )
}
