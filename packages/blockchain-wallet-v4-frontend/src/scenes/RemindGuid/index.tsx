import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, formValueSelector, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/forms'
import { actions } from 'data'
import { Button, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'

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

class RemindGuid extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  constructor(props) {
    super(props)
    this.state = {
      isFormSubmitted: false,
      recaptchaToken: null,
    }
  }

  componentDidMount() {
    /* eslint-disable */
    // @ts-ignore
    const recaptchaKey = RECAPTCHA_KEY
    // @ts-ignore
    window.grecaptcha.enterprise.ready(() => {
      // @ts-ignore
      window.grecaptcha.enterprise.execute(recaptchaKey, {
        action: 'GUID_REMINDER',
      })
      .then((recaptchaToken) => {
        this.setState({ recaptchaToken })
      })
      .catch((e) => {
        console.error('recaptcha error', e)
      })
    })
    /* eslint-enable */
  }

  onSubmit = (e) => {
    e.preventDefault()
    // @ts-ignore
    const { recaptchaToken } = this.state
    const { authActions, email } = this.props
    console.log(recaptchaToken)

    authActions.remindGuid(email, recaptchaToken)
    this.setState({ isFormSubmitted: true })
  }

  render() {
    const { invalid } = this.props
    console.info(this.props)
    // @ts-ignore
    const { isFormSubmitted } = this.state

    return (
      <Wrapper>
        <Header>
          <Text size='20px' color='blue900' weight={600} capitalize>
            <FormattedMessage id='scenes.reminder.reminder' defaultMessage='Wallet ID Reminder' />
          </Text>
        </Header>
        {isFormSubmitted ? (
          <>
            <Text size='14px' style={{ margin: '28px 0' }} weight={500}>
              <FormattedMessage
                id='scenes.reminder.thanks'
                defaultMessage='Thank you for submitting your request. If a wallet ID associated with this email address exists, you will receive an email with your ID shortly.'
              />
            </Text>
            <LinkContainer to='/login'>
              <Button data-e2e='continueToLogin' nature='primary' fullwidth>
                <FormattedMessage id='scenes.reminder.login' defaultMessage='Continue to Login' />
              </Button>
            </LinkContainer>
          </>
        ) : (
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <FormItem>
                <FormLabel htmlFor='email'>
                  <FormattedMessage id='scenes.reminder.email' defaultMessage='Email' />
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
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('walletGuidReminder')(state, 'email'),
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
})

type Props = {
  email: string
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const enhance = compose(
  reduxForm<{ form: string }, Props>({ form: 'walletGuidReminder' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RemindGuid)
