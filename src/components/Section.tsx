/** @format */

import { HTMLAttributes, PropsWithChildren } from 'react'
import SPHeader from './Header'

const styles = {
  marginTop: '1.5rem',
}
const headerStyles = { marginBottom: '0.5rem' }
type Props = {
  title: string
  navIcon?: JSX.Element
  actions?: JSX.Element
} & HTMLAttributes<HTMLDivElement>

export default function SPSection(props: PropsWithChildren<Props>) {
  return (
    <div {...props} className="flex-column" style={styles}>
      <SPHeader size="small" style={headerStyles}>
        {props.title}
      </SPHeader>
      <div>{props.children}</div>
    </div>
  )
}
