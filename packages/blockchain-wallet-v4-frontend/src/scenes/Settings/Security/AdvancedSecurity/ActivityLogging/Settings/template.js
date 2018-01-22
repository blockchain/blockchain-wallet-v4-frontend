import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, activityLoggingEnabled } = props
  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleClick}>
        { activityLoggingEnabled
          ? <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.settings.disable' defaultMessage='Disable' />
          : <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging..settings.enable' defaultMessage='Enable' />
        }
      </Button>
    </SettingWrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
