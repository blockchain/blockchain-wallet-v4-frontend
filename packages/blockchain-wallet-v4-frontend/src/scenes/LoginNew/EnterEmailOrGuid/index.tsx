import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'

import { Text } from 'blockchain-info-components'
import {
  // Form,
  // FormError,
  FormGroup,
  FormItem,
  // FormLabel,
  // PasswordBox,
  TextBox
} from 'components/Form'
// import { LinkContainer } from 'react-router-bootstrap'
// import Bowser from 'bowser'
import { required, validWalletIdOrEmail } from 'services/forms'

import { LoginSteps, Props as OwnProps } from '..'
import {
  ActionButton,
  isSupportedBrowser,
  LoginFormLabel,
  removeWhitespace
} from '../model'

const EnterEmailOrGuid = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
     busy,
     invalid,
     loginError,
     setStep,
     submitting,
  } = props

  const accountLocked =
      loginError &&
      (loginError.toLowerCase().includes('this account has been locked') ||
        loginError.toLowerCase().includes('account is locked'))
  const guidError =
    loginError && loginError.toLowerCase().includes('unknown wallet id')

  console.log(props, 'from enter email')
  return (
    <>
      <FormGroup>
        <FormItem>
          <LoginFormLabel htmlFor='guid'>
            <FormattedMessage
              id='scenes.login.email_or_guid'
              defaultMessage='Your Email or Wallet ID'
            />
          </LoginFormLabel>
          <Field
            component={TextBox}
            data-e2e='loginGuidOrEmail'
            disabled={!isSupportedBrowser}
            disableSpellcheck
            name='guidOrEmail'
            normalize={removeWhitespace}
            validate={[required, validWalletIdOrEmail]}
            placeholder='Enter your email or wallet ID'
          />
        </FormItem>
        {/* {guidError && (
  <GuidError inline>
    <Text
      size='12px'
      color='error'
      weight={400}
      data-e2e='walletIdError'
    >
      <FormattedMessage
        id='scenes.login.guiderror'
        defaultMessage='Unknown Wallet ID. If you need a reminder '
      />
    </Text>
    <LinkContainer to='/reminder'>
      <Link size='12px' weight={500}>
        <FormattedMessage
          id='scenes.login.clickhere'
          defaultMessage='click here.'
        />
      </Link>
    </LinkContainer>
  </GuidError>
)} */}
        {/* {showGuidInvalidError && (
  <LoginTextGroup inline>
    <Text size='12px' color='grey800' weight={500}>
      {isGuidEmailAddress ? (
        <FormattedMessage
          id='scenes.login.isguidemailerror'
          defaultMessage='👋 Hey! Make sure this is your Wallet ID and not an email address. If you need a reminder'
        />
      ) : (
        <FormattedMessage
          id='scenes.login.isguidinvalid'
          defaultMessage="👋 Hey! This format doesn't look quite right. Wallet ID's look like this: ef7549a5-94ad-39...If you need a reminder"
        />
      )}
    </Text>
    <LinkContainer to='/reminder'>
      <Link size='12px' weight={600}>
        <FormattedMessage
          id='scenes.login.clickhere'
          defaultMessage='click here.'
        />
      </Link>
    </LinkContainer>
  </LoginTextGroup>
)} */}
      </FormGroup>
      <FormGroup>
        <ActionButton
          // type='submit'
          nature='primary'
          fullwidth
          height='48px'
          // disabled={submitting || invalid || busy || !password}
          data-e2e='loginButton'
          onClick={()=> setStep(LoginSteps.CHECK_EMAIL)}
        >
          {/* {busy && !loginError ? (
    <HeartbeatLoader height='20px' width='20px' color='white' />
    ) : ( */}
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
          </Text>
          {/* )} */}
        </ActionButton>
      </FormGroup>
    </>
  )
}

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void 
}

export default EnterEmailOrGuid
