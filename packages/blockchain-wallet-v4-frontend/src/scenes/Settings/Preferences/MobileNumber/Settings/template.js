import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, smsNumber, smsVerified, modalActions, showWarning, resetWarning } = props

  return (
    <SettingWrapper>
      {
        showWarning
          ? <Fragment>
            <Text>
              <FormattedMessage id='scenes.preferences.mobile.settings.2fa_warning' defaultMessage='To change your mobile number you need to disable 2FA via SMS' />
            </Text>
            <Button nature='primary' onClick={() => {
              resetWarning()
              modalActions.showModal('ConfirmDisable2FA', {
                authName: '2FA using SMS',
                extraCopy: <FormattedMessage id='scenes.preferences.mobile.settings.reenable_sec_center' defaultMessage='If you want to re-enable this feature, please go to the Security Center.' />
              })
            }} >
              <FormattedMessage id='scenes.preferences.mobile.settings.disable_2fa' defaultMessage='Disable 2FA' />
            </Button>
          </Fragment>
          : <Fragment>
            {
              smsNumber && <Text>{smsNumber}</Text>
            }
            <Button nature='primary' onClick={handleClick}>
              { smsVerified === 1
                ? <FormattedMessage id='scenes.preferences.mobile.settings.change' defaultMessage='Change' />
                : smsNumber
                  ? <FormattedMessage id='scenes.preferences.mobile.settings.verify' defaultMessage='Verify' />
                  : <FormattedMessage id='scenes.preferences.mobile.settings.addmobile' defaultMessage='Add Mobile Number' />
              }
            </Button>
          </Fragment>
      }
    </SettingWrapper>
  )
}

Setting.propTypes = {
  smsNumber: PropTypes.string,
  smsVerified: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Setting
