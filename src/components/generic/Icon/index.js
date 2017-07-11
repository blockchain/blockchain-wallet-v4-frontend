import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'components/generic/Typography'

const Icon = (props) => {
  const { name, ...rest } = props

  return (
    <Typography {...rest}>
      <i className={name} />
    </Typography>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
}

export { Icon }
