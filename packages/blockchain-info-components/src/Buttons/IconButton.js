import React from 'react'
import styled from 'styled-components'

import { Icon } from '../Icons'
import Button from './Button'

const BaseIconButton = styled(Button)`
  width: auto;
  & > :first-child {
    margin-right: 8px;
  }
`

const selectColor = (nature, disabled) => {
  if (disabled) {
    return 'white'
  }

  switch (nature) {
    case 'primary':
    case 'secondary':
    case 'copy':
    case 'received':
    case 'sent':
    case 'transferred':
    case 'logout':
    case 'dark':
      return 'white'
    case 'light':
    case 'white-transparent':
    case 'white-blue':
      return 'blue600'
    default:
      return 'grey800'
  }
}

const IconButton = props => {
  const { children, name, nature, ...rest } = props
  const color = selectColor(nature)

  return (
    <BaseIconButton {...rest}>
      <Icon name={name} color={color} />
      {children}
    </BaseIconButton>
  )
}

export default IconButton
