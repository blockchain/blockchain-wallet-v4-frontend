import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from '../Text'

const IconImage = styled.i``

const Icon = (props) => {
  const { name, ...rest } = props

  return (
    <Text {...rest}>
      <IconImage className={name} />
    </Text>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
}

export default Icon
