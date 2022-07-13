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

import { Props as OwnProps } from '../..'
import {
  ActionButton,
  BackArrowFormHeader,
  ResetFormSteps,
  ReverifyIdentityInfoBox
} from '../../model'

const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const validatePasswordConfirmation = validPasswordConfirmation('resetAccountPassword')

const NewPassword = (props: Props) => {
  const { emailFromMagicLink, invalid, isRegistering, setFormStep, setStep } = props
  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => setFormStep(ResetFormSteps.TWO_FA_CONFIRMATION)}
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
              defaultMessage='Password must be at least 8 characters in length and contain at least one uppercase letter, lowercase letter, number and symbol.'
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
      <Text style={{ cursor: 'pointer' }} onClick={() => setFormStep(ResetFormSteps.NEW_TWOFA)}>
        Placeholder skip text
      </Text>
    </>
  )
}

type Props = OwnProps & {
  isRegistering: boolean
  setFormStep: (step) => void
}
export default NewPassword
