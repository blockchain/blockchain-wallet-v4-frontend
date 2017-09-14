import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'

const Settings = (props) => {
  const { isTwoStepVerificationEnabled, handleClick } = props

  return (
    <Button nature='primary' onClick={handleClick}>
      { isTwoStepVerificationEnabled
        ? <FormattedMessage id='scenes.settings.twostepverification.disable' defaultMessage='Disable' />
        : <FormattedMessage id='scenes.settings.twostepverification.enable' defaultMessage='Enable' />
      }
    </Button>
  )
}

Settings.propTypes = {
  isTwoStepVerificationEnabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
