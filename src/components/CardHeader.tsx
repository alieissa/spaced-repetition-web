/** @format */

import clsx from 'clsx'
import { CardProps } from 'semantic-ui-react'
import SPHeader from './Header'

export default function SPCardHeader(props: CardProps) {
  return <SPHeader {...props} className={clsx(props.className)} />
}
