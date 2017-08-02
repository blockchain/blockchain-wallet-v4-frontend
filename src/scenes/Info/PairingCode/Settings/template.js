import React from 'react'
import PropTypes from 'prop-types'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <SecondaryButton onClick={handleClick}>
      <Text id='scenes.info.pairingcode.settings.show' text='Show pairing code' small light white />
    </SecondaryButton>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
