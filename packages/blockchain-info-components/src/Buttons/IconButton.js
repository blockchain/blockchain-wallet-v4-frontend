import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from './Button'
import { Icon } from '../Icons'

const BaseIconButton = styled(Button)`
  width: auto;
  min-width: 0;

  & > :first-child { margin: 0 5px; }
`

const selectColor = (nature, disabled) => {
  if (disabled) { return { color: 'white' } }

  switch (nature) {
    case 'empty': return { color: 'black' }
    case 'primary': return { color: 'white' }
    case 'secondary': return { color: 'white' }
    case 'copy': return { color: 'white' }
    case 'received': return { color: 'white' }
    case 'sent': return { color: 'white' }
    case 'transferred': return { color: 'white' }
    case 'logout': return { color: 'white' }
    case 'dark': return { color: 'white' }
    default: return { color: 'black' }
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
  name: PropTypes.string.isRequired
}

export default IconButton
