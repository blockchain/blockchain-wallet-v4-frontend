import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { formValueSelector, Field } from 'redux-form'

import { TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'
import FAQ1 from './faq.js'

import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ColRightInner, EmailHelper } from 'components/BuySell/Signup'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const CancelText = styled.p`
  text-align: center;
  cursor: pointer;
  font-size: 14px;
`

class VerifyEmail extends Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.emailVerified && nextProps.ui.uniqueEmail) nextProps.updateUI({ create: 'change_mobile' })
  }
  constructor (props) {
    super(props)
    this.state = {}

    this.onSubmit = this.onSubmit.bind(this)
    this.resendCode = this.resendCode.bind(this)
  }

  componentDidMount () {
    if (this.props.ui.create === 'enter_email_code') {
      this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.oldEmail)
    }

    this.props.formActions.change('sfoxCreate', 'emailAddress', this.props.oldEmail)
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create === 'enter_email_code') {
      this.props.sfoxFrontendActions.clearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.updateEmail(this.props.emailAddress)
    }
  }

  render () {
    const { ui, invalid, emailVerifiedError } = this.props

    let emailHelper = () => {
      switch (true) {
        case emailVerifiedError: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.error' defaultMessage="That code doesn't match. {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
        case ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
      }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.header' defaultMessage="What's your email?" />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.subheader' defaultMessage="Enter the email address you would like to use with your SFOX account. We'll send you a verification code to make sure it's yours." />
            </PartnerSubHeader>
            {
              ui.create === 'enter_email_code'
                ? <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedHTMLMessage id='sfoxexchangedata.create.verifyemail.code' defaultMessage='We emailed a verification code to {email}' values={{email: this.props.emailAddress}} />
                  </Text>
                  <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                  <EmailHelper error={emailVerifiedError}>
                    { emailHelper() }
                  </EmailHelper>
                </EmailInput>
                : <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.confirm' defaultMessage='Confirm Email:' />
                  </Text>
                  <Field name='emailAddress' component={TextBox} validate={[required]} />
                </EmailInput>
            }
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            {
              ui.create === 'enter_email_code'
                ? <ButtonWrapper>
                  <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
                  </Button>
                </ButtonWrapper>
                : <ButtonWrapper>
                  <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.sendverificationemail' defaultMessage='Send Verification Code Email' />
                  </Button>
                  <CancelText onClick={() => this.props.updateUI({create: 'create_account'})}>Cancel</CancelText>
                </ButtonWrapper>
            }
            <FAQ1 />
          </ColRightInner>
        </ColRight>
      </Form>
    )
  }
}

VerifyEmail.propTypes = {
  ui: PropTypes.object,
  invalid: PropTypes.boolean,
  updateUI: PropTypes.function,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = (state) => ({
  oldEmail: selectors.core.settings.getEmail(state).data,
  emailCode: formValueSelector('sfoxCreate')(state, 'emailCode'),
  emailAddress: formValueSelector('sfoxCreate')(state, 'emailAddress')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false } })
)

export default enhance(VerifyEmail)
