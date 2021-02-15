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
  // Semantic UI does not not accept white as color so remove and also does not have a name prop
  const buttonProps = _.chain(props)
    .omitBy((value, prop) => prop === 'color' && value === 'white')
    .omit('name')
    .omit('iconColor')
    .value()

  return (
    <Button
      {...buttonProps}
      style={props.color === 'white' ? styles.bgWhite : {}}
    >
      <Icon name={props.name} color={props.iconColor}></Icon>
    </Button>
  )
}
