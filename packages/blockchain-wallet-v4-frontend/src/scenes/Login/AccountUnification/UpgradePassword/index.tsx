import React from 'react'
import { FormattedMessage } from 'react-intl'
import { has } from 'ramda'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FormGroup, FormLabel, PasswordBox } from 'components/Form'
import { AccountUnificationFlows, LoginSteps } from 'data/types'
import { required, validPasswordConfirmation, validStrongPassword } from 'services/forms'

import { Props } from '../../index'
import { ActionButton, BackArrowFormHeader, LinkRow, NeedHelpLink } from '../../model'

const validatePasswordConfirmation = validPasswordConfirmation('upgradeAccountPassword')

const UpgradePassword = (props: Props) => {
  const handleBackArrowClick = () => {
    props.setStep(LoginSteps.UPGRADE_CONFIRM)
  }

  const handleUpgradeAccountClick = () => {
    if (props.accountUnificationFlow === AccountUnificationFlows.EXCHANGE_UPGRADE) {
      // create new wallet with password
      // then merge accounts?
    }
  }
  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} hideGuid />
      <FormGroup>
        <FormLabel htmlFor='upgradePassword'>
          <FormattedMessage id='copy.enter_new_password' defaultMessage='Enter New Password' />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='upgradeAccountPassword'
          validate={[required, validStrongPassword]}
          component={PasswordBox}
          showPasswordScore
          passwordScore={has('zxcvbn', window) ? window.zxcvbn(props.upgradePassword).score : 0}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor='confirmationPassword'>
          <FormattedMessage id='copy.confirm_new_password' defaultMessage='Confirm New Password' />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='confirmationPassword'
          validate={[required, validatePasswordConfirmation]}
          component={PasswordBox}
        />
      </FormGroup>
      <LinkRow>
        <ActionButton
          nature='primary'
          fullwidth
          height='48px'
          // disabled={submitting || busy}
          data-e2e='upgradeButton'
          style={{ margin: '16px 0 24px' }}
        >
          {/* {submitting ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : ( */}
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.upgrade_account' defaultMessage='Upgrade Account' />
          </Text>
          {/* )} */}
        </ActionButton>
        <NeedHelpLink authActions={props.authActions} origin='UPGRADE_ACCOUNT_NEW_PASSWORD' />
      </LinkRow>
    </>
  )
}

export default UpgradePassword
