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

const IconButton = props => {
  const { name, children, ...rest } = props

  return (
    <BaseIconButton {...rest}>
      <Icon name={name} />
      { children }
    </BaseIconButton>
  )
}

PropTypes.propTypes = {
  name: PropTypes.string.isRequired
}

export default IconButton
