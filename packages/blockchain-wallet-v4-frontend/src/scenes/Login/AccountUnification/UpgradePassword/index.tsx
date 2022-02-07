import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormLabel, PasswordBox } from 'components/Form'
import { LoginSteps } from 'data/types'
import { required, validPasswordConfirmation, validStrongPassword } from 'services/forms'

import BackArrowHeader from '../../components/BackArrowHeader'
import { Props } from '../../index'
import { ActionButton, LinkRow, LoginWrapper } from '../../model'

const validatePasswordConfirmation = validPasswordConfirmation('upgradeAccountPassword')

const UpgradePassword = (props: Props) => {
  const handleBackArrowClick = () => {
    props.setStep(LoginSteps.UPGRADE_CONFIRM)
  }
  const { upgradePassword = '' } = props.formValues || {}
  const passwordScore = window.zxcvbn ? window.zxcvbn(upgradePassword).score : 0

  return (
    <LoginWrapper>
      <BackArrowHeader {...props} handleBackArrowClick={handleBackArrowClick} hideGuid />
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
          passwordScore={passwordScore}
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
          type='submit'
          disabled={props.submitting || props.busy}
          data-e2e='upgradeButton'
          style={{ margin: '16px 0 24px' }}
        >
          {props.submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage id='buttons.upgrade_account' defaultMessage='Upgrade Account' />
            </Text>
          )}
        </ActionButton>
      </LinkRow>
    </LoginWrapper>
  )
}

export default UpgradePassword
