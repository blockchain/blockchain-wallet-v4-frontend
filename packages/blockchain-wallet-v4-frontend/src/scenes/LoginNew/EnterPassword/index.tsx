import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import {
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox
} from 'components/Form'
import { selectors } from 'data'
import { required } from 'services/forms'

import { LoginSteps, Props as OwnProps } from '..'
import { ActionButton } from '../model'

const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 23px;
`
const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const EnterPassword = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    authType,
    busy,
    formValues,
    invalid,
    loginError,
    setStep,
    submitting
  } = props

  const passwordError =
    loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  return (
    <>
      <TopRow>
        <Icon
          cursor
          data-e2e='signupBack'
          name='arrow-left'
          size='24px'
          color='grey400'
          style={{ marginRight: '6px' }}
          role='button'
          onClick={() => setStep(LoginSteps.ENTER_EMAIL_GUID)}
        />
        <Text color='grey400' size='14px' weight={600}>
          <FormattedMessage
            id='scenes.login.signingin_email'
            defaultMessage='Signing in with {email}'
            values={{ email: formValues.guidOrEmail }}
          />
        </Text>
      </TopRow>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password'
            />
          </FormLabel>
          <Field
            name='password'
            validate={[required]}
            component={PasswordBox}
            data-e2e='loginPassword'
            placeholder='Enter your password'
          />
          {passwordError && (
            <FormError
              position={authType > 0 ? 'relative' : 'absolute'}
              data-e2e='passwordError'
            >
              <FormattedMessage
                id='scenes.login.wrong_password'
                defaultMessage='Error decrypting wallet. Wrong password'
              />
            </FormError>
          )}
          {accountLocked && (
            <FormError
              position={authType > 0 || passwordError ? 'relative' : 'absolute'}
            >
              {loginError}
            </FormError>
          )}
        </FormItem>
      </FormGroup>
      <LinkRow>
        <ActionButton
          // type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy}
          data-e2e='passwordButton'
          style={{ marginBottom: '16px' }}

          //   onClick={}
        >
          {/* {busy && !loginError ? (
    <HeartbeatLoader height='20px' width='20px' color='white' />
    ) : ( */}
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
          </Text>
          {/* )} */}
        </ActionButton>
        <LinkContainer to='/help'>
          <Link size='13px' weight={600} data-e2e='loginGetHelp'>
            <FormattedMessage
              id='scenes.login.needhelp'
              defaultMessage='Need some help?'
            />
          </Link>
        </LinkContainer>
      </LinkRow>
    </>
  )
}

const mapStateToProps = state => ({
  authType: selectors.auth.getAuthType(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(EnterPassword)
