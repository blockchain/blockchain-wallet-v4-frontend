import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'

import { HeartbeatLoader, Icon, Link, Text } from 'blockchain-info-components'
import {
  // Form,
  // FormError,
  FormGroup,
  FormItem,
  // FormLabel,
  // PasswordBox,
  TextBox
} from 'components/Form'
import { LoginSteps } from 'data/types'
// import Bowser from 'bowser'
import { isGuid, required, validWalletIdOrEmail } from 'services/forms'

import { Props as OwnProps } from '..'
import {
  ActionButton,
  HelpRow,
  IconTextRow,
  isSupportedBrowser,
  LinkRow,
  LoginFormLabel,
  NeedHelpLink,
  RectangleBackground,
  removeWhitespace
} from '../model'

const EnterEmailOrGuid = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    busy,
    formActions,
    guidOrEmail,
    invalid,
    loginError,
    setStep,
    submitting
  } = props

  // TODO move to saga
  const handleContinue = () => {
    if (isGuid(guidOrEmail)) {
      formActions.change('loginNew', 'guid', guidOrEmail)
      setStep(LoginSteps.VERIFICATION_MOBILE)
    } else {
      formActions.change('loginNew', 'email', guidOrEmail)
      props.authNewActions.loginGuid(guidOrEmail)
    }
  }
  // const accountLocked =
  //     loginError &&
  //     (loginError.toLowerCase().includes('this account has been locked') ||
  //       loginError.toLowerCase().includes('account is locked'))
  // const guidError =
  //   loginError && loginError.toLowerCase().includes('unknown wallet id')

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
      <LinkRow>
        <ActionButton
          // type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !guidOrEmail}
          data-e2e='loginButton'
          style={{ marginBottom: '16px' }}
          // TODO: change this to trigger call for email
          onClick={() => handleContinue()}
        >
          {busy && !loginError ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            </Text>
          )}
        </ActionButton>
        <NeedHelpLink />
      </LinkRow>
      <RectangleBackground>
        <HelpRow>
          <IconTextRow>
            <Icon name='info' size='14px' color='grey400' />
            <Text size='12px' weight={500} color='grey600'>
              <FormattedMessage
                id='scenes.login.now_login'
                defaultMessage='You can now log in with your email.'
              />
            </Text>
          </IconTextRow>
          <Link
            size='12px'
            weight={500}
            // TODO: get actual support article
            href='https://support.blockchain.com/hc/en-us/'
          >
            <FormattedMessage
              id='buttons.learn_more'
              defaultMessage='Learn More'
            />
          </Link>
        </HelpRow>
      </RectangleBackground>
    </>
  )
}

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
}

export default EnterEmailOrGuid
