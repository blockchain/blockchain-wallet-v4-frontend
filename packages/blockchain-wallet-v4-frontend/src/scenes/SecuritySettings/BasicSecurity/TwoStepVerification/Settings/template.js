import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'

const Settings = (props) => {
  const { authType, handleClick } = props

  return (
    <Button nature='primary' onClick={handleClick}>
      { authType === 0
        ? <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Enable' />
        : <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable' defaultMessage='Disable' />
      }
    </Button>
  )
}

Settings.propTypes = {
  authType: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
