import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Button } from 'blockchain-info-components'

const Settings = props => {
  const { authTypeNeverSave, handleClick } = props

  return (
    <Button nature='primary' onClick={handleClick}>
      {authTypeNeverSave === 0 ? (
        <FormattedMessage
          id='scenes.securitysettings.basicsecurity.twostepverificationremember.settings.disable'
          defaultMessage='Disable'
        />
      ) : (
        <FormattedMessage
          id='scenes.securitysettings.basicsecurity.twostepverificationremember.settings.enable'
          defaultMessage='Enable'
        />
      )}
    </Button>
  )
}

Settings.propTypes = {
  authTypeNeverSave: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
