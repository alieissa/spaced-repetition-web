/** @format */

import * as _ from 'lodash'
import React from 'react'
import { Button, ButtonProps, Icon, IconProps } from 'semantic-ui-react'
import { styles } from 'src/styles'

interface Props extends Omit<ButtonProps, 'color'> {
  // Semantic UI Button does not accept colour white so add it
  color?: ButtonProps['color'] | 'white'
  iconColor?: IconProps['color']
  name: IconProps['name']
}

export default function IconButton(props: Props) {
  const t = props.color
  return (
    <Button
      {..._.omit(props, 'name')}
      style={props.color === 'white' ? styles.bgWhite : {}}
    >
      <Icon name={props.name} color={props.iconColor}></Icon>
    </Button>
  )
}
