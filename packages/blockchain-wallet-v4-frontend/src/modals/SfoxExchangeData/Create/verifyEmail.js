import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { FormattedMessage } from 'react-intl'
import { reduxForm, formValueSelector, Field } from 'redux-form'

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
    this.toChangeEmailStep = this.toChangeEmailStep.bind(this)
  }

  componentDidMount () {
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.oldEmail)
    this.props.formActions.change('sfoxCreateVerifyEmail', 'emailAddress', this.props.oldEmail)
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  toChangeEmailStep () {
    this.props.updateUI({ enterCode: false })
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.enterCode) {
      this.props.settingsActions.verifyEmail(this.props.emailCode)
      this.props.doneChangingEmail()
      this.props.sfoxFrontendActions.clearSignupError()
    } else {
      this.props.settingsActions.updateEmail(this.props.emailAddress)
      this.props.updateUI({ enterCode: true })
    }
  }

  render () {
    const { ui, invalid } = this.props

    let emailHelper = () => {
      switch (true) {
        case ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='sfoxexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={this.toChangeEmailStep}>change email</a> }} />
      }
    }

    return (
      <form onSubmit={this.onSubmit}>
        <Wrapper>
          {
            ui.enterCode
              ? <EmailInput>
                <Text size='14px' weight={400}>
                  <FormattedMessage id='sfoxexchangedata.create.verifyemail.code' defaultMessage='Verification Code:' />
                </Text>
                <Field name='emailCode' component={TextBox} validate={[required]} />
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
                  <CancelText onClick={() => this.props.doneChangingEmail()}>Cancel</CancelText>
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
  doneChangingEmail: PropTypes.function,
  oldEmail: PropTypes.string
}

const mapStateToProps = (state) => ({
  oldEmail: selectors.core.settings.getEmail(state).data,
  emailCode: formValueSelector('sfoxCreateVerifyEmail')(state, 'emailCode'),
  emailAddress: formValueSelector('sfoxCreateVerifyEmail')(state, 'emailAddress')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false, enterCode: true } })
)

export default reduxForm({ form: 'sfoxCreateVerifyEmail' })(enhance(VerifyEmail))
