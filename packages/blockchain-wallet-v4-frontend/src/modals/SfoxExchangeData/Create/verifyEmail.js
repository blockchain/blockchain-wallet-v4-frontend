import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { reduxForm, formValueSelector, Field } from 'redux-form'

import { TextBox, Form } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'

import { required } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
`
const MobileInput = styled.div`
  display: flex;
  flex-direction: column;
`
const MobileCodeContainer = MobileInput.extend`
  margin-top: 45px;
`
const FieldWrapper = styled.div`
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

class VerifyEmail extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.resendCode = this.resendCode.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.toChangeEmailStep = this.toChangeEmailStep.bind(this)
  }

  componentDidMount () {
    this.props.formActions.change('sfoxCreateVerifyEmail', 'emailAddress', this.props.oldEmail)
  }

  resendCode () {
    this.props.settingsActions.updateEmail(this.props.emailAddress)
    this.props.updateUI({ codeSent: true })
  }

  toChangeEmailStep () {
    this.props.updateUI({ enterCode: false })
  }

  toAcceptTerms () {

  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.enterCode) {
      console.log('verifyEmail', this.props.emailCode)
      this.props.settingsActions.verifyEmail(this.props.emailCode)
      this.props.doneChangingEmail()
    } else {
      console.log('updateEmail', this.props.emailAddress)
      this.props.settingsActions.updateEmail(this.props.emailAddress)
      this.props.updateUI({ enterCode: true })
    }
  }

  render () {
    const { ui, invalid } = this.props
    console.log('render verify email', this.props);
    return (
      <form onSubmit={this.onSubmit}>
        <Wrapper>
          {
            ui.enterCode
              ? <MobileInput>
                <Text size='14px' weight={400}>
                  Verification code:
                </Text>
                <Field name='emailCode' component={TextBox} validate={[required]} />
                <MixedText>
                  Didn't receive the email? { ui.codeSent ? <a>Sent!</a> : <span><a onClick={this.resendCode}>Resend</a> or <a onClick={this.toChangeEmailStep}>change email</a></span> }
                </MixedText>
                <ButtonWrapper>
                  <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                    Continue
                  </Button>
                </ButtonWrapper>
              </MobileInput>
              : <MobileInput>
                <Text size='14px' weight={400}>
                  Confirm email:
                </Text>
                <Field name='emailAddress' component={TextBox} validate={[required]} />
                <ButtonWrapper>
                  <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                    Send Verification Email
                  </Button>
                  <p onClick={this.toAcceptTerms}>Cancel</p>
                </ButtonWrapper>
              </MobileInput>
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
  emailAddress: formValueSelector('sfoxCreateVerifyEmail')(state, 'emailAddress'),
  emailCode: formValueSelector('sfoxCreateVerifyEmail')(state, 'emailCode')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false, enterCode: false } })
)

export default reduxForm({ form: 'sfoxCreateVerifyEmail' })(enhance(VerifyEmail))
