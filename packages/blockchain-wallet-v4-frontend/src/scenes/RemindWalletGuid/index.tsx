import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { Field, formValueSelector, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { RemoteDataType } from 'core/remote/types'
import { actions, selectors } from 'data'
import { required, validEmail } from 'services/forms'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`

class RemindGuid extends React.PureComponent<InjectedFormProps<{}, Props> & Props, StateProps> {
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
    const recaptchaKey = RECAPTCHA_KEY
    // @ts-ignore
    window.grecaptcha.enterprise.ready(() => {
      // @ts-ignore
      window.grecaptcha.enterprise.execute(recaptchaKey, {
        action: 'GUID_REMINDER',
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
        this.props.actions.remindWalletGuid(captchaToken, this.props.email)
      })
    }

    this.props.actions.remindWalletGuid(this.state.captchaToken, this.props.email)
  }

  render() {
    const { invalid, remindGuidR } = this.props

    return (
      <Wrapper>
        <Header>
          <Text size='20px' color='blue900' weight={600} capitalize>
            <FormattedMessage
              id='scenes.walletguidreminder.title'
              defaultMessage='Wallet ID Reminder'
            />
          </Text>
        </Header>
        {remindGuidR.cata({
          Failure: () => (
            <>
              <Text size='14px' style={{ margin: '28px 0' }} weight={500}>
                <FormattedMessage
                  id='scenes.walletguidreminder.error'
                  defaultMessage='We were unable to process your request at this time. Please try again or contact support if the issue persists.'
                />
              </Text>
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
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <FormItem>
                  <FormLabel htmlFor='email'>
                    <FormattedMessage id='copy.email' defaultMessage='Email' />
                  </FormLabel>
                  <Field
                    bgColor='grey000'
                    name='email'
                    autoFocus
                    validate={[required, validEmail]}
                    component={TextBox}
                  />
                </FormItem>
              </FormGroup>
              <Footer>
                <LinkContainer to='/help'>
                  <Button data-e2e='guidReminderBack' nature='empty-blue'>
                    <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
                  </Button>
                </LinkContainer>
                <Button
                  data-e2e='guidReminderContinue'
                  disabled={invalid}
                  nature='primary'
                  type='submit'
                >
                  <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                </Button>
              </Footer>
            </Form>
          ),
          Success: () => (
            <>
              <Text size='14px' style={{ margin: '28px 0' }} weight={500}>
                <FormattedMessage
                  id='scenes.walletguidreminder.success'
                  defaultMessage='Thank you for submitting your request. If a wallet ID associated with this email address exists, you will receive an email with your ID shortly.'
                />
              </Text>
              <LinkContainer to='/login'>
                <Button data-e2e='continueToLogin' nature='primary' fullwidth>
                  <FormattedMessage
                    id='buttons.continue_to_login'
                    defaultMessage='Continue to Login'
                  />
                </Button>
              </LinkContainer>
            </>
          )
        })}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('walletGuidReminder')(state, 'email'),
  remindGuidR: selectors.components.remindWalletGuid.getFormRequestState(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.remindWalletGuid, dispatch)
})

type LinkStatePropsType = {
  actions: typeof actions.components.remindWalletGuid
  email?: string
  remindGuidR: RemoteDataType<string, null>
}

type StateProps = {
  captchaToken?: string
}

type Props = LinkStatePropsType

// @ts-ignore
const enhance = compose(
  reduxForm<{}, Props>({ form: 'walletGuidReminder' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RemindGuid) as React.ComponentType
