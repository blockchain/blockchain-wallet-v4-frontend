import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick, blockTorIps } = props
  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleClick}>
        {blockTorIps
          ? <FormattedMessage id='scenes.securitysettings.advancedsettings.walletaccesstor.settings.allow' defaultMessage='Allow' />
          : <FormattedMessage id='scenes.securitysettings.advancedsettings.walletaccesstor.settings.block' defaultMessage='Block' />
        }
      </Button>
    </SettingWrapper>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
