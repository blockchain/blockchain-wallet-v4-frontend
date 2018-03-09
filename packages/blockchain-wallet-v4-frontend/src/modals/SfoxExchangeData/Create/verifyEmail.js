import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, Field } from 'redux-form'

import { TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'

import { required } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
`
const EmailInput = styled.div`
  display: flex;
  flex-direction: column;
`
const ButtonWrapper = styled.div`
  margin: 25px 0px;
`
const MixedText = styled.span`
  margin-top: 10px;
  font-size: 14px;
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const CancelText = styled.p`
  text-align: center;
  cursor: pointer;
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

    let emailHelper = () => {
      switch (true) {
        case ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
      }
    }

    return (
      <form onSubmit={this.onSubmit}>
        <Wrapper>
          {
            ui.create === 'enter_email_code'
              ? <EmailInput>
                <Text size='14px' weight={400}>
                  <FormattedMessage id='sfoxexchangedata.create.verifyemail.code' defaultMessage='Verification Code:' />
                </Text>
                <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                <MixedText>
                  { emailHelper() }
                </MixedText>
                <ButtonWrapper>
                  <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
                  </Button>
                </ButtonWrapper>
              </EmailInput>
              : <EmailInput>
                <Text size='14px' weight={400}>
                  <FormattedMessage id='sfoxexchangedata.create.verifyemail.confirm' defaultMessage='Confirm Email:' />
                </Text>
                <Field name='emailAddress' component={TextBox} validate={[required]} />
                <ButtonWrapper>
                  <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                    <FormattedMessage id='sfoxexchangedata.create.verifyemail.sendverificationemail' defaultMessage='Send Verification Code Email' />
                  </Button>
                  <CancelText onClick={() => this.props.updateUI({create: 'enter_email_code'})}>Cancel</CancelText>
                </ButtonWrapper>
              </EmailInput>
          }
        </Wrapper>
      </form>
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
