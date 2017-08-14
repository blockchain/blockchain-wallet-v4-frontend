import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from 'components'

const IconImage = styled.i``

const Icon = (props) => {
  const { name, ...rest } = props

  return (
    <Typography {...rest}>
      <IconImage className={name} />
    </Typography>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
}

export { Icon }
