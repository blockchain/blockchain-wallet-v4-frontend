import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, ipLockOn } = props
  return (
    <SettingWrapper>
      <Button nature='secondary' onClick={handleClick}>
        {ipLockOn
          ? <FormattedMessage id='scenes.security.iprestriction.disable' defaultMessage='Disable' />
          : <FormattedMessage id='scenes.security.iprestriction.enable' defaultMessage='Enable' />
        }
      </Button>
    </SettingWrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
