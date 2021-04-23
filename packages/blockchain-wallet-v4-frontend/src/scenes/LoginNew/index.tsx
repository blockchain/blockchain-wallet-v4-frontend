import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { getFormMeta, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Loading from '../loading.public'
import CheckEmail from './CheckEmail'
// step templates
import EnterEmailOrGuid from './EnterEmailOrGuid'
import EnterPassword from './EnterPassword'
import EnterTwoFactor from './EnterTwoFactor'
import { LOGIN_NEW } from './model'
import VerificationMobile from './VerificationMobile'

// TODO: move this
export enum LoginSteps {
  ENTER_EMAIL_GUID,
  ENTER_PASSWORD,
  ENTER_TWO_FACTOR,
  LOADING,
  CHECK_EMAIL,
  VERIFICATION_MOBILE
}

type LoginFormType = {
  guidOrEmail: string
  password: string
  step: LoginSteps
  twoFA?: number | string
}

// TODO: remove temp
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

class Login extends PureComponent<Props> {
  componentDidMount() {
    // TODO: browser check
    // TODO: check for existing cookie/localstorage?
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(LOGIN_NEW, 'step', step)
  }

  render() {
    const { data, formValues } = this.props
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID
    const { busy, error } = data.cata({
      Success: () => ({ error: null, busy: false }),
      Failure: val => ({ error: val.err, busy: false }),
      Loading: () => ({ error: null, busy: true }),
      NotAsked: () => ({ error: null, busy: false })
    })
    const loginProps = {
      busy,
      loginError: error
    }
    // console.log(this.props, 'from main index')
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
          <Form>
            {(() => {
              switch (step) {
                case LoginSteps.ENTER_EMAIL_GUID:
                  // @ts-ignore
                  return (
                    <EnterEmailOrGuid
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                    />
                  )
                case LoginSteps.ENTER_PASSWORD:
                  // @ts-ignore
                  return (
                    <EnterPassword
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                    />
                  )

                case LoginSteps.ENTER_TWO_FACTOR:
                  return <EnterTwoFactor />

                case LoginSteps.CHECK_EMAIL:
                  // @ts-ignore
                  return (
                    <CheckEmail
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                    />
                  )

                case LoginSteps.VERIFICATION_MOBILE:
                  // @ts-ignore
                  return (
                    <VerificationMobile
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                    />
                  )

                case LoginSteps.LOADING:
                default:
                  return <Loading />
              }
            })()}
          </Form>
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
        </ButtonRow>
      </>
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.auth.getLogin(state),
  formValues: selectors.form.getFormValues(LOGIN_NEW)(state) as LoginFormType,
  formMeta: getFormMeta(LOGIN_NEW)(state),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  }
})

const mapDispatchToProps = dispatch => ({
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
