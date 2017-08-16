import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'blockchain-info-components'

const Settings = (props) => {
  const { guid } = props

  return (
    <Typography>{guid}</Typography>
  )
}

Settings.propTypes = {
  guid: PropTypes.string.isRequired
}

export default Settings
