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

import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ColRightInner, EmailHelper } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`

class VerifyEmail extends Component {
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

  componentDidUpdate (prevProps) {
    if (this.props.emailVerified && !prevProps.emailVerified) this.props.updateUI({ create: 'change_mobile' })
    if (this.props.emailVerified && this.props.ui.uniqueEmail && !this.props.editVerifiedEmail) this.props.updateUI({ create: 'change_mobile' })
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
    const { ui, invalid, emailVerifiedError, emailAddress, emailCode } = this.props

    let emailHelper = () => {
      switch (true) {
        case emailVerifiedError: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.error' defaultMessage="That code doesn't match. {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
        case ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent! {changeEmail}' values={{ changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
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
                    <FormattedHTMLMessage id='sfoxexchangedata.create.verifyemail.code' defaultMessage='We emailed a verification code to {email}' values={{email: emailAddress}} />
                  </Text>
                  <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} errorBottom validate={[required]} />
                  <EmailHelper error={emailVerifiedError}>
                    { emailHelper() }
                  </EmailHelper>
                </EmailInput>
                : <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.confirm' defaultMessage='Confirm Email:' />
                  </Text>
                  <Field name='emailAddress' component={TextBox} validate={[required]} />
                  <Button nature='primary' type='submit' disabled={!emailAddress} style={spacing('mt-15')}>
                    <FormattedMessage id='sfoxexchangedata.create.mobile.number' defaultMessage='Send Email Verification Code' />
                  </Button>
                </EmailInput>
            }
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button type='submit' nature='primary' fullwidth uppercase disabled={invalid || ui.create !== 'enter_email_code' || !emailCode}>
                <FormattedMessage id='sfoxexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
              </Button>
            </ButtonWrapper>
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
