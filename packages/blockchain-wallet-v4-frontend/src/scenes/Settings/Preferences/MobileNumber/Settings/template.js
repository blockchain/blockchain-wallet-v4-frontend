import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { Button, Text } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { handleClick, modalActions, resetWarning, showWarning, smsNumber, smsVerified } = props

  return (
    <SettingWrapper>
      {showWarning ? (
        <>
          <Text>
            <FormattedMessage
              id='scenes.settings.preferences.mobilenumber.settings.2fawarning'
              defaultMessage='To change your mobile number you need to disable 2FA via SMS'
            />
          </Text>
          <Button
            data-e2e='disable2faBtn'
            nature='primary'
            onClick={() => {
              resetWarning()
              modalActions.showModal('CONFIRM_DISABLE_2FA', {
                authName: '2FA using SMS',
                extraCopy: (
                  <FormattedMessage
                    id='scenes.settings.preferences.mobilenumber.settings.reenableseccenter'
                    defaultMessage='If you want to re-enable this feature, please go to the Security Center.'
                  />
                )
              })
            }}
          >
            <FormattedMessage
              id='scenes.settings.preferences.mobilenumber.settings.disable2fa'
              defaultMessage='Disable 2FA'
            />
          </Button>
        </>
      ) : (
        <>
          {smsNumber && (
            <Text color='grey800' size='15px' weight={600}>
              {smsNumber}
            </Text>
          )}
          {smsVerified === 1 ? (
            <Button nature='primary' onClick={handleClick} data-e2e='prefsMobileNumberChange'>
              <FormattedMessage
                id='scenes.settings.preferences.mobilenumber.settings.change'
                defaultMessage='Change'
              />
            </Button>
          ) : smsNumber ? (
            <Button nature='primary' onClick={handleClick} data-e2e='prefsMobileNumberVerify'>
              <FormattedMessage
                id='scenes.settings.preferences.mobilenumber.settings.verify'
                defaultMessage='Verify'
              />
            </Button>
          ) : (
            <Button nature='primary' onClick={handleClick} data-e2e='prefsMobileNumberAdd'>
              <FormattedMessage
                id='scenes.settings.preferences.mobilenumber.settings.addmobile'
                defaultMessage='Add Mobile Number'
              />
            </Button>
          )}
        </>
      )}
    </SettingWrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired,
  smsNumber: PropTypes.string,
  smsVerified: PropTypes.number.isRequired
}

export default Setting
