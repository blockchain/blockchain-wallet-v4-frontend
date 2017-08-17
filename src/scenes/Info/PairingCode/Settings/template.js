import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <Button type='secondary' onClick={handleClick}>
      <FormattedMessage id='scenes.info.pairingcode.settings.show' defaultMessage='Show pairing code' small light white />
    </Button>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
