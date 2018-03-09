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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = styled.div`
  width: 50%;
`
const InputWrapper = styled.div`
  width: 80%;
`
const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
`
const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 14px;
`
const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const ButtonWrapper = styled.div`
  margin: 25px 0px;
`
const EmailHelper = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: ${props => props.theme['gray-3']};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const CancelText = styled.p`
  text-align: center;
  cursor: pointer;
  font-size: 14px;
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
      this.props.formActions.change('sfoxCreate', 'emailAddress', this.props.oldEmail)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.emailVerified && nextProps.ui.uniqueEmail) {
      this.props.updateUI({ create: 'change_mobile' })
    }
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create === 'enter_email_code') {
      this.props.sfoxFrontendActions.clearSignupError()
      this.props.settingsActions.verifyEmail(this.props.emailCode)
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.settingsActions.updateEmail(this.props.emailAddress)
    }
  }

  render () {
    const { ui, invalid } = this.props

    let partnerHeader = () => {
      switch (ui.create) {
        case 'enter_email_code': return <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.header.enter_email_code' defaultMessage='Blockchain + SFOX' />
        case 'change_email': return <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.header.change_email' defaultMessage='Change Email' />
      }
    }

    let partnerSubHeader = () => {
      switch (ui.create) {
        case 'enter_email_code': return <FormattedHTMLMessage id='sfoxexchangedata.create.verifyemail.partner.subheader.enter_email_code' defaultMessage='We teamed up with SFOX’s exchange platform to offer buy and sell to our customers in the United States. We just sent a verification code to your <b>{email}</b> email address.' values={{email: this.props.emailAddress}} />
        case 'change_email': return <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.subheader.change_email' defaultMessage='Updating your email will also change the email associated with your wallet.' />
      }
    }

    let emailHelper = () => {
      switch (true) {
        case ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
      }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              { partnerHeader() }
            </PartnerHeader>
            <PartnerSubHeader>
              { partnerSubHeader() }
            </PartnerSubHeader>
            {
              ui.create === 'enter_email_code'
                ? <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.code' defaultMessage='Enter your verification code to get started:' />
                  </Text>
                  <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                  <EmailHelper>
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
          {
            ui.create === 'enter_email_code'
              ? <ButtonWrapper>
                <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='sfoxexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
                </Button>
              </ButtonWrapper>
              : <ButtonWrapper>
                <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='sfoxexchangedata.create.verifyemail.sendverificationemail' defaultMessage='Send Verification Code Email' />
                </Button>
                <CancelText onClick={() => this.props.updateUI({create: 'enter_email_code'})}>Cancel</CancelText>
              </ButtonWrapper>
          }
        </ColRight>
      </Form>
    )
  }
}

VerifyEmail.propTypes = {
  ui: PropTypes.object,
  invalid: PropTypes.boolean,
  updateUI: PropTypes.function,
  settingsActions: PropTypes.object,
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
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false } })
)

export default enhance(VerifyEmail)
