import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, blockTorIps } = props
  return (
    <SettingWrapper>
      <Button nature='primary' onClick={handleClick}>
        {blockTorIps
          ? <FormattedMessage id='scenes.security.tor.allowtorips' defaultMessage='Allow' />
          : <FormattedMessage id='scenes.security.tor.blocktorips' defaultMessage='Block' />
        }
      </Button>
    </SettingWrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
