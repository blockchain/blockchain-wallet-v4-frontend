import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import {
  formValueSelector,
  getFormMeta,
  InjectedFormProps,
  reduxForm
} from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { LoginFormType, LoginSteps } from 'data/types'
import { isGuid } from 'services/forms'

import Loading from '../loading.public'
import CheckEmail from './CheckEmail'
// step templates
import EnterEmailOrGuid from './EnterEmailOrGuid'
import EnterPassword from './EnterPassword'
import EnterTwoFactor from './EnterTwoFactor'
import { LOGIN_NEW, SignUpText, SubCard } from './model'
import VerificationMobile from './VerificationMobile'

// TODO: remove temp
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

class Login extends PureComponent<InjectedFormProps & Props> {
  componentDidMount() {
    this.props.authNewActions.initializeLogin()
    // TODO: browser check
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(LOGIN_NEW, 'step', step)
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      authActions,
      authNewActions,
      code,
      formActions,
      formValues,
      guid,
      guidOrEmail,
      password
    } = this.props
    let auth = code
    // only uppercase if authType is not Yubikey
    if (auth && this.props.authType !== 1) {
      auth = auth.toUpperCase()
    }
    if (formValues.step === LoginSteps.ENTER_EMAIL_GUID) {
      if (isGuid(guidOrEmail)) {
        formActions.change(LOGIN_NEW, 'guid', guidOrEmail)
        authNewActions.guidWallet(guidOrEmail)
      } else {
        formActions.change(LOGIN_NEW, 'email', guidOrEmail)
        authNewActions.loginGuid(guidOrEmail)
      }
    } else {
      authActions.login(guid, password, auth)
    }
  }

  handleSmsResend = () => {
    this.props.authActions.resendSmsCode(this.props.guid)
  }

  render() {
    const { data, formValues } = this.props
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID
    const { busy, error } = data.cata({
      Success: () => ({ error: null, busy: false }),
      Failure: val => ({ error: val.err, busy: false }),
      Loading: () => <Loading />,
      NotAsked: () => ({ error: null, busy: false })
    })
    const loginProps = {
      busy,
      loginError: error,
      handleSmsResend: this.handleSmsResend
    }
    return (
      <>
        <Text
          color='white'
          size={'24px'}
          weight={600}
          style={{ marginBottom: '30px' }}
        >
          {step === LoginSteps.ENTER_TWO_FACTOR ? (
            <FormattedMessage
              id='scenes.login.authorize'
              defaultMessage='Authorize login'
            />
          ) : (
            <FormattedMessage
              id='scenes.login.welcome'
              defaultMessage='Welcome back!'
            />
          )}
        </Text>
        <Text color='grey400' weight={500} style={{ marginBottom: '24px' }}>
          {step === LoginSteps.VERIFICATION_MOBILE && (
            <FormattedMessage
              id='scenes.login.approve'
              defaultMessage='Approve your login'
            />
          )}
          {step === LoginSteps.ENTER_PASSWORD && (
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password to login'
            />
          )}
          {step === LoginSteps.ENTER_TWO_FACTOR && (
            <FormattedMessage
              id='scenes.logins.twofa.code'
              defaultMessage='Enter the Two Factor Authentication code from your code generator or the SMS message just sent'
            />
          )}
        </Text>
        <Wrapper>
          {(() => {
            switch (step) {
              case LoginSteps.ENTER_EMAIL_GUID:
                return (
                  <EnterEmailOrGuid
                    {...this.props}
                    {...loginProps}
                    setStep={this.setStep}
                    handleSubmit={this.handleSubmit}
                  />
                )
              case LoginSteps.ENTER_PASSWORD:
                return (
                  <EnterPassword
                    {...this.props}
                    {...loginProps}
                    setStep={this.setStep}
                    handleSubmit={this.handleSubmit}
                  />
                )

              case LoginSteps.ENTER_TWO_FACTOR:
                return (
                  <EnterTwoFactor
                    {...this.props}
                    {...loginProps}
                    setStep={this.setStep}
                    handleSubmit={this.handleSubmit}
                  />
                )

              case LoginSteps.CHECK_EMAIL:
                return (
                  <CheckEmail
                    {...this.props}
                    {...loginProps}
                    setStep={this.setStep}
                    handleSubmit={this.handleSubmit}
                  />
                )

              case LoginSteps.VERIFICATION_MOBILE:
                return (
                  <VerificationMobile
                    {...this.props}
                    {...loginProps}
                    setStep={this.setStep}
                    handleSubmit={this.handleSubmit}
                  />
                )
              default:
                return null
            }
          })()}
        </Wrapper>

        <ButtonRow>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_EMAIL_GUID)}
          >
            Enter Email/Guid
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_PASSWORD)}
          >
            Enter Password
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_TWO_FACTOR)}
          >
            Enter 2FA
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.CHECK_EMAIL)}
          >
            Check Email
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.VERIFICATION_MOBILE)}
          >
            Verify Mobile
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.LOADING)}
          >
            Loading
          </Button>
        </ButtonRow>
        {step === LoginSteps.ENTER_EMAIL_GUID && (
          <LinkContainer data-e2e='signupLink' to='/signup'>
            <Link>
              <SubCard>
                <Text size='16px' color='grey400' weight={500}>
                  <FormattedMessage
                    id='scenes.login.wallet.link_signup'
                    defaultMessage="Don't have a Blockchain Wallet?"
                  />
                </Text>
                &nbsp;
                <SignUpText size='16px' color='white' weight={600}>
                  <FormattedMessage
                    id='buttons.signup_now'
                    defaultMessage='Sign up Now ->'
                  />
                </SignUpText>
              </SubCard>
            </Link>
          </LinkContainer>
        )}
      </>
    )
  }
}

const mapStateToProps = state => ({
  authType: selectors.auth.getAuthType(state),
  code: formValueSelector(LOGIN_NEW)(state, 'code'),
  data: selectors.auth.getLogin(state),
  formValues: selectors.form.getFormValues(LOGIN_NEW)(state) as LoginFormType,
  formMeta: getFormMeta(LOGIN_NEW)(state),
  // TODO guid selector shouldn't come from form
  // we set it on the state when we get the callback
  guid: formValueSelector(LOGIN_NEW)(state, 'guid'),
  guidOrEmail: formValueSelector(LOGIN_NEW)(state, 'guidOrEmail'),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  password: formValueSelector(LOGIN_NEW)(state, 'password')
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  authNewActions: bindActionCreators(actions.authNew, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

const enhance = compose<any>(
  reduxForm({
    form: LOGIN_NEW
  }),
  connector
)

export default enhance(Login)
