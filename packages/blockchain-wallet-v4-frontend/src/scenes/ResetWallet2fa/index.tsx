import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { RemoteDataType } from 'core/remote/types'
import { actions, selectors } from 'data'
import { required, validEmail, validWalletId } from 'services/forms'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const ResetForm = styled(Form)`
  margin-top: 15px;
`
const InfoMsg = styled(Text)`
  margin-top: 5px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const GoBackLink = styled(LinkContainer)`
  margin-right: 15px;
`
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
`

const validNullableEmail = (emailVal) => {
  return emailVal && emailVal.length ? validEmail(emailVal) : undefined
}

class ResetWallet2fa extends React.PureComponent<InjectedFormProps<{}, Props> & Props, StateProps> {
  constructor(props) {
    super(props)
    this.state = {
      captchaToken: undefined
    }
  }

  componentDidMount() {
    this.initCaptcha()
  }

  componentWillUnmount() {
    this.props.actions.resetForm()
  }

  initCaptcha = (callback?) => {
    /* eslint-disable */
    // @ts-ignore
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    // @ts-ignore
    window.grecaptcha.enterprise.ready(() => {
      // @ts-ignore
      window.grecaptcha.enterprise.execute(window.RECAPTCHA_KEY, {
        action: 'RESET_2FA',
      })
        .then((captchaToken) => {
          console.log('Captcha success')
          this.setState({ captchaToken })
          callback && callback(captchaToken)
        })
        .catch((e) => {
          console.error('Captcha error: ', e)
        })
    })
    /* eslint-enable */
  }

  onSubmit = (e) => {
    e.preventDefault()

    // sometimes captcha doesnt mount correctly (race condition?)
    // if it's undefined, try to re-init for token
    if (!this.state.captchaToken) {
      return this.initCaptcha((captchaToken) => {
        this.props.actions.resetWallet2fa(captchaToken, this.props.formValues)
      })
    }

    this.props.actions.resetWallet2fa(this.state.captchaToken, this.props.formValues)
  }

  render() {
    const { invalid, resetWallet2faR } = this.props

    return (
      <Wrapper>
        <Header>
          <Text size='20px' color='blue900' weight={600} capitalize>
            <FormattedMessage id='scenes.reset2fa.firststep.reset' defaultMessage='Reset 2FA' />
          </Text>
        </Header>
        {resetWallet2faR.cata({
          Failure: (val) => (
            <>
              <Text size='14px' style={{ margin: '28px 0 16px' }} weight={500}>
                <FormattedMessage
                  id='scenes.walletguidreminder.error'
                  defaultMessage='We were unable to process your request at this time. Please try again or contact support if the issue persists.'
                />
              </Text>
              {val && (
                <Text color='red600' size='14px' style={{ margin: '0 0 28px' }} weight={500}>
                  Error: {val}
                </Text>
              )}
              <LinkContainer to='/login'>
                <Button data-e2e='continueToLogin' nature='primary' fullwidth>
                  <FormattedMessage
                    id='buttons.continue_to_login'
                    defaultMessage='Continue to Login'
                  />
                </Button>
              </LinkContainer>
            </>
          ),
          Loading: () => (
            <LoadingWrapper>
              <SpinningLoader width='40px' height='40px' />
            </LoadingWrapper>
          ),
          NotAsked: () => (
            <>
              <TextGroup>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.reset2fa.firststep.explain'
                    defaultMessage='Fill out the form below to regain access to your wallet by resetting your 2FA, restricted IP, and verified email.'
                  />
                </Text>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.reset2fa.firststep.explain2'
                    defaultMessage='Note: Your IP address and browser information will be recorded upon submission.'
                  />
                </Text>
              </TextGroup>
              <ResetForm onSubmit={this.onSubmit}>
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='guid'>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.walletid'
                        defaultMessage='Wallet ID'
                      />
                    </FormLabel>
                    <Field
                      bgColor='grey000'
                      autoFocus
                      component={TextBox}
                      disableSpellcheck
                      name='guid'
                      validate={[required, validWalletId]}
                    />
                    <TextGroup inline>
                      <Text size='12px' weight={400}>
                        <FormattedMessage
                          id='scenes.reset2fa.firststep.firststepform.guidexplain'
                          defaultMessage='If you forgot your wallet identifier, please'
                        />
                      </Text>
                      <LinkContainer to='/reminder'>
                        <Link size='12px' weight={500}>
                          <FormattedMessage
                            id='scenes.reset2fa.firststep.look'
                            defaultMessage='look it up here.'
                          />
                        </Link>
                      </LinkContainer>
                    </TextGroup>
                  </FormItem>
                </FormGroup>
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='email'>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.email'
                        defaultMessage='Registered Email'
                      />
                    </FormLabel>
                    <Field
                      bgColor='grey000'
                      name='email'
                      validate={[required, validEmail]}
                      component={TextBox}
                    />
                    <Text size='12px' weight={400}>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.emailexplain'
                        defaultMessage="Enter the email associated with your wallet (even if you've lost access to it)."
                      />
                    </Text>
                  </FormItem>
                </FormGroup>
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='newEmail'>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.newEmail'
                        defaultMessage='New Email (Optional)'
                      />
                    </FormLabel>
                    <Field
                      bgColor='grey000'
                      name='newEmail'
                      validate={[validNullableEmail]}
                      component={TextBox}
                    />
                    <InfoMsg size='12px' weight={400}>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.newEmailExplain'
                        defaultMessage="Enter your updated email if you've lost access to your previously verified email. If your 2FA reset request is approved, this will automatically be set as your wallet's new email address."
                      />
                    </InfoMsg>
                  </FormItem>
                </FormGroup>
                <Footer>
                  <GoBackLink to='/help'>
                    <Button data-e2e='reset2faBack' nature='empty-blue'>
                      <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
                    </Button>
                  </GoBackLink>
                  <Button
                    data-e2e='2faResetContinue'
                    type='submit'
                    nature='primary'
                    disabled={invalid}
                  >
                    <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                  </Button>
                </Footer>
              </ResetForm>
            </>
          ),
          Success: () => (
            <>
              <TextGroup inline style={{ margin: '32px 0' }}>
                <Text size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.message'
                    defaultMessage='Thank you for submitting a two-factor authentication reset request. Please check your email for further instructions.'
                  />
                </Text>
                <Text size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.info'
                    defaultMessage='This process usually takes two weeks. If you would like to learn more about the reset process, visit our'
                  />
                </Text>
                <Link
                  size='14px'
                  weight={500}
                  href='https://support.blockchain.com/hc/en-us/articles/360000286426-I-lost-my-2FA-device-How-do-I-get-back-into-my-wallet-'
                  target='_blank'
                >
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.infolink'
                    defaultMessage='support page.'
                  />
                </Link>
              </TextGroup>
              <Footer>
                <LinkContainer to='/login'>
                  <Button data-e2e='reset2faContinue' nature='primary' fullwidth>
                    <FormattedMessage
                      id='buttons.continue_to_login'
                      defaultMessage='Continue to Login'
                    />
                  </Button>
                </LinkContainer>
              </Footer>
            </>
          )
        })}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('wallet2faReset')(state),
  resetWallet2faR: selectors.components.resetWallet2fa.getFormRequestState(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.resetWallet2fa, dispatch)
})

type LinkStatePropsType = {
  actions: typeof actions.components.resetWallet2fa
  formValues: {
    email: string
    guid: string
    newEmail?: string
  }
  resetWallet2faR: RemoteDataType<string, null>
}

type StateProps = {
  captchaToken?: string
}

type Props = LinkStatePropsType

// @ts-ignore
const enhance = compose(
  reduxForm<{}, Props>({ form: 'wallet2faReset' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ResetWallet2fa) as React.ComponentType
