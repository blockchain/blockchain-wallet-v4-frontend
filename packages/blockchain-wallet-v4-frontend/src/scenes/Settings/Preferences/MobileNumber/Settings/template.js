import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, smsNumber, smsVerified } = props

  return (
    <SettingWrapper>
      {
        smsNumber && <Text>{smsNumber}</Text>
      }
      <Button nature='primary' onClick={handleClick}>
        { smsVerified === 1
          ? <FormattedMessage id='scenes.preferences.mobile.settings.change' defaultMessage='Change' />
          : smsNumber
            ? <FormattedMessage id='scenes.preferences.mobile.settings.verify' defaultMessage='Verify' />
            : <FormattedMessage id='scenes.preferences.mobile.settings.verify' defaultMessage='Add Mobile Number' />
        }
      </Button>
    </SettingWrapper>
  )
}

Setting.propTypes = {
  smsNumber: PropTypes.string,
  smsVerified: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Setting
