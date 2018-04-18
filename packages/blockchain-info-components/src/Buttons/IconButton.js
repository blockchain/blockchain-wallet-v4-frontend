import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from './Button'
import { Icon } from '../Icons'

const BaseIconButton = styled(Button)`
  width: auto;
  min-width: ${props => props.min};
  max-width: ${props => props.max};
  & > :first-child { margin: 0 5px; }
`

const selectColor = (nature, disabled) => {
  if (disabled) { return 'white' }

  switch (nature) {
    case 'empty': return 'gray-6'
    case 'primary': return 'white'
    case 'secondary': return 'white'
    case 'copy': return 'white'
    case 'received': return 'white'
    case 'sent': return 'white'
    case 'transferred': return 'white'
    case 'logout': return 'white'
    case 'dark': return 'white'
    default: return 'gray-6'
  }
}

const IconButton = props => {
  const { name, children, ...rest } = props
  const color = selectColor(props.nature)

  return (
    <BaseIconButton {...rest}>
      <Icon name={name} color={color} />
      { children }
    </BaseIconButton>
  )
}

PropTypes.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.string,
  max: PropTypes.string
}

export default IconButton
