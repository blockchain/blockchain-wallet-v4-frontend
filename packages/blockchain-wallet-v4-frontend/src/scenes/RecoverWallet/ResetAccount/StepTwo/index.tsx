import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import Terms from 'components/Terms'
import { RecoverSteps } from 'data/types'
import { required, validPasswordConfirmation, validStrongPassword } from 'services/forms'

import { ActionButton, BackArrowFormHeader, ReverifyIdentityInfoBox } from '../../model'
import { Props as OwnProps } from '..'

const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const validatePasswordConfirmation = validPasswordConfirmation('resetAccountPassword')

const SecondStep = (props: Props) => {
  const { emailFromMagicLink, formValues, invalid, isRegistering, setStep } = props
  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
        email={emailFromMagicLink}
        step={RecoverSteps.RESET_ACCOUNT}
      />
      <FormGroup>
        <FormLabel htmlFor='password'>
          <FormattedMessage id='copy.new_password' defaultMessage='New Password' />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='resetAccountPassword'
          validate={[required, validStrongPassword]}
          component={PasswordBox}
        />
        <div>
          <Text size='12px' weight={400} style={{ marginTop: '4px' }}>
            <FormattedMessage
              id='scenes.register.passwordstrengthwarn'
              defaultMessage='Password must be at least 12 characters in length and contain at least one uppercase letter, lowercase letter, number and symbol.'
            />
          </Text>
        </div>
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor='confirmationPassword'>
          <FormattedMessage
            id='scenes.recover.secondstep.confirmapassword'
            defaultMessage='Confirm Password'
          />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='confirmationPassword'
          validate={[required, validatePasswordConfirmation]}
          component={PasswordBox}
        />
      </FormGroup>
      <FormGroup>
        <Terms recovery />
      </FormGroup>
      <ReverifyIdentityInfoBox />
      <Footer>
        <ActionButton
          data-e2e='recoverSubmit'
          disabled={isRegistering || invalid}
          nature='primary'
          type='submit'
          fullwidth
        >
          {isRegistering ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='scenes.recover.secondstep.recover'
              defaultMessage='Recover Funds'
            />
          )}
        </ActionButton>
      </Footer>
    </>
  )
}

type Props = OwnProps & {
  isRegistering: boolean
}
export default SecondStep
