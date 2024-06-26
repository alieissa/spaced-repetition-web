import _ from 'lodash'

type Props = {
  message: string
}
export default function NotFound(props: Props) {
  return (
    <div {..._.omit(props, 'message')}>
      not found
      <div>{props.message}</div>
    </div>
  )
}
