/** @format */

import clsx from 'clsx'
import _ from 'lodash'
import { HTMLAttributes, PropsWithChildren } from 'react'
import SPHeader from './Header'

const headerStyles = { fontSize: '1.5rem' }

type Props = {
  title: string
  navIcon?: JSX.Element
  actions?: JSX.Element
} & HTMLAttributes<HTMLDivElement>

export default function SPSectionHeader(props: PropsWithChildren<Props>) {
  return (
    <div
      {..._.omit(props, ['navIcon', 'actions'])}
      className={clsx('justify-space-between', props.className)}
      style={{
        padding: '1rem 1rem 1rem 2rem',
        lineHeight: '2rem',
        borderBottom: '1px solid',
        ...props.style,
      }}
    >
      <div className="align-center">
        {props.navIcon && <div>{props.navIcon}</div>}
        <SPHeader style={headerStyles}>{props.title}</SPHeader>
      </div>
      {props.actions && <div>{props.actions}</div>}
    </div>
  )
}
