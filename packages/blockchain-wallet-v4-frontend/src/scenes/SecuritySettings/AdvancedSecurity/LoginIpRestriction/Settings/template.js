import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick, ipLockOn } = props
  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleClick}>
        {ipLockOn
          ? <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.settings.disable' defaultMessage='Disable' />
          : <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.settings.enable' defaultMessage='Enable' />
        }
      </Button>
    </SettingWrapper>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
