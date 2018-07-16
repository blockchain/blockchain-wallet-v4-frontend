import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'blockchain-info-components'

const Settings = props => {
  const { guid } = props

  return <Text>{guid}</Text>
}

Settings.propTypes = {
  guid: PropTypes.string.isRequired
}

export default Settings
