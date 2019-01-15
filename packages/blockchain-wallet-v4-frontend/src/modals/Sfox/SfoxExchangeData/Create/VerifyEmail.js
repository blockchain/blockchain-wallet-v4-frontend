import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, Field } from 'redux-form'

import { actions, selectors } from 'data'
import { TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'
import { required } from 'services/FormHelper'
import {
  Form,
  ColLeft,
  ColRight,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  ButtonWrapper,
  ColRightInner,
  EmailHelper
} from 'components/IdentityVerification'
import { spacing } from 'services/StyleService'
import media from 'services/ResponsiveService'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const VerifyEmailForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
  `};
`

class VerifyEmail extends Component {
  state = {}

  componentDidMount () {
    if (this.props.create === 'enter_email_code') {
      this.props.securityCenterActions.sendConfirmationCodeEmail(
        this.props.oldEmail
      )
    }
    this.props.formActions.change(
      'sfoxCreate',
      'emailAddress',
      this.props.oldEmail
    )
    this.props.sfoxFrontendActions.sfoxNotAsked()
  }

  componentDidUpdate (prevProps) {
    if (this.props.emailVerified && !prevProps.emailVerified) {
      this.props.updateStep('change_mobile')
    }
    if (
      this.props.emailVerified &&
      this.state.uniqueEmail &&
      !this.props.editVerifiedEmail
    ) {
      this.props.updateStep('change_mobile')
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  resendCode = () => {
    this.setState({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(
      this.props.emailAddress
    )
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.props.create === 'enter_email_code') {
      this.props.sfoxFrontendActions.clearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
    } else {
      this.props.updateStep('enter_email_code')
      this.props.securityCenterActions.updateEmail(
        this.props.emailAddress,
        true
      )
    }
  }

  render () {
    const { invalid, emailVerifiedError, emailAddress, emailCode } = this.props

    let emailHelper = () => {
      switch (true) {
        case emailVerifiedError:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.verifyemail.helper.error'
              defaultMessage="That code doesn't match. {resend} or {changeEmail}."
              values={{
                resend: <a onClick={this.resendCode}>Resend</a>,
                changeEmail: (
                  <a onClick={() => this.updateStep('change_email')}>
                    change email
                  </a>
                )
              }}
            />
          )
        case this.props.codeSent:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.verifyemail.helper.sentanothercode'
              defaultMessage='Another code has been sent! {changeEmail}'
              values={{
                changeEmail: (
                  <a onClick={() => this.updateStep('change_email')}>
                    change email
                  </a>
                )
              }}
            />
          )
        case !this.state.codeSent:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.verifyemail.helper.didntreceive'
              defaultMessage="Didn't receive your email? {resend} or {changeEmail}."
              values={{
                resend: <a onClick={this.resendCode}>Resend</a>,
                changeEmail: (
                  <a onClick={() => this.updateStep('change_email')}>
                    change email
                  </a>
                )
              }}
            />
          )
      }
    }

    return (
      <VerifyEmailForm onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage
                id='sfoxexchangedata.create.verifyemail.partner.header'
                defaultMessage="What's your email?"
              />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage
                id='sfoxexchangedata.create.verifyemail.partner.subheader'
                defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address and phone number."
              />
            </PartnerSubHeader>
            {this.props.create === 'enter_email_code' ? (
              <EmailInput>
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='sfoxexchangedata.create.verifyemail.code'
                    defaultMessage='We emailed a verification code to {email}'
                    values={{ email: emailAddress }}
                  />
                </Text>
                <Field
                  name='emailCode'
                  onChange={() => this.setState({ uniqueEmail: true })}
                  component={TextBox}
                  errorBottom
                  validate={[required]}
                />
                <EmailHelper error={emailVerifiedError}>
                  {emailHelper()}
                </EmailHelper>
              </EmailInput>
            ) : (
              <EmailInput>
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='sfoxexchangedata.create.verifyemail.confirm'
                    defaultMessage='Confirm Email:'
                  />
                </Text>
                <Field
                  name='emailAddress'
                  component={TextBox}
                  errorBottom
                  validate={[required]}
                />
                <Button
                  nature='primary'
                  type='submit'
                  disabled={!emailAddress}
                  style={spacing('mt-15')}
                >
                  <FormattedMessage
                    id='sfoxexchangedata.create.mobile.number'
                    defaultMessage='Send Email Verification Code'
                  />
                </Button>
              </EmailInput>
            )}
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button
                type='submit'
                nature='primary'
                fullwidth
                disabled={
                  invalid ||
                  this.props.create !== 'enter_email_code' ||
                  !emailCode
                }
              >
                <FormattedMessage
                  id='sfoxexchangedata.create.verifyemail.continue'
                  defaultMessage='Continue'
                />
              </Button>
            </ButtonWrapper>
          </ColRightInner>
        </ColRight>
      </VerifyEmailForm>
    )
  }
}

VerifyEmail.propTypes = {
  invalid: PropTypes.bool,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = state => ({
  oldEmail: selectors.core.settings.getEmail(state).getOrElse(''),
  emailCode: formValueSelector('sfoxCreate')(state, 'emailCode'),
  emailAddress: formValueSelector('sfoxCreate')(state, 'emailAddress')
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyEmail)
