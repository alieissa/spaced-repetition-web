/** @format */

import clsx from 'clsx'
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

export default function SPSectionHeader(props: PropsWithChildren<Props>) {
  return (
    <div
      {...props}
      className={clsx('justify-space-between', props.className)}
      style={{
        padding: '1rem 1rem 1rem 2rem',
        lineHeight: '2rem',
        ...props.style,
      }}
    >
      <div className="align-center">
        {props.navIcon && <div>{props.navIcon}</div>}
        <SPHeader style={{ fontSize: '1.5rem' }}>{props.title}</SPHeader>
      </div>
      {props.actions && <div>{props.actions}</div>}
    </div>
  )
}
