import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions } from 'data'
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
const MobileInput = styled.div`
  display: flex;
  flex-direction: column;
`
const MobileCodeContainer = MobileInput.extend`
  margin-top: 25px;
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

class VerifyMobile extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.onSubmit = this.onSubmit.bind(this)
    this.resendCode = this.resendCode.bind(this)
    this.updateMobileNumber = this.updateMobileNumber.bind(this)
  }

  componentDidMount () {
    if (this.props.smsNumber) {
      this.props.formActions.change('sfoxCreateVerifyMobile', 'mobileNumber', this.props.smsNumber)
    }
  }

  updateMobileNumber () {
    this.props.updateUI({ smsCodeSent: true })
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  resendCode () {
    this.props.updateUI({ smsCodeResent: true })
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  onSubmit (e) {
    e.preventDefault()
    if (!this.props.ui.smsCodeSent) {
      this.updateMobileNumber()
    } else {
      this.props.settingsActions.verifyMobile(this.props.mobileCode)
    }
  }

  render () {
    const { ui, invalid } = this.props

    let smsHelper = () => {
      switch (true) {
        case ui.smsCodeResent: return <FormattedMessage id='sfoxexchangedata.create.mobile.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.smsCodeResent: return <FormattedMessage id='sfoxexchangedata.create.mobile.helper.didntreceive' defaultMessage="Didn't receive your code? {resend}." values={{ resend: <a onClick={this.resendCode}>Resend</a> }} />
      }
    }

    return (
      <form onSubmit={this.onSubmit}>
        <Wrapper>
          <MobileInput>
            <Text size='14px' weight={400}>
              <FormattedMessage id='sfoxexchangedata.create.mobile.number' defaultMessage='Add Phone Number:' />
            </Text>
            <Field name='mobileNumber' component={TextBox} validate={[required]} />
            {
              !ui.smsCodeSent && <ButtonWrapper>
                <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='sfoxexchangedata.create.mobile.textcode' defaultMessage='Text Verification Code' />
                </Button>
              </ButtonWrapper>
            }
          </MobileInput>
          {
            ui.smsCodeSent && <MobileCodeContainer>
              <Text size='14px' weight={400}>
                <FormattedMessage id='sfoxexchangedata.create.mobile.entercode' defaultMessage='Enter Verification Code:' />
              </Text>
              <FieldWrapper>
                <Field name='mobileCode' component={TextBox} validate={[required]} />
                <MixedText>
                  { smsHelper() }
                </MixedText>
              </FieldWrapper>
            </MobileCodeContainer>
          }
          {
            ui.smsCodeSent && <ButtonWrapper>
              <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                Continue
              </Button>
            </ButtonWrapper>
          }
        </Wrapper>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  mobileNumber: formValueSelector('sfoxCreateVerifyMobile')(state, 'mobileNumber'),
  mobileCode: formValueSelector('sfoxCreateVerifyMobile')(state, 'mobileCode')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false, smsCodeResent: false } })
)

export default reduxForm({ form: 'sfoxCreateVerifyMobile' })(enhance(VerifyMobile))
