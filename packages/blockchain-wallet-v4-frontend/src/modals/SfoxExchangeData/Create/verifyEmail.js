import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions } from 'data'
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

    this.sendEmailCode = this.sendEmailCode.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    // if (this.props.smsNumber.length > 4) {
    //   this.props.formActions.change('sfoxCreateVerifyEmail', 'mobileNumber', this.props.smsNumber)
    // }
  }

  sendEmailCode () {

  }

  onSubmit (e) {
    e.preventDefault()
    // this.props.settingsActions.verifyMobile(this.props.mobileCode)
  }

  render () {
    const { ui, invalid } = this.props
    console.log('render verify email', this.props);
    return (
      <form onSubmit={this.onSubmit}>
        <Wrapper>
          <MobileInput>
            <Text size='14px' weight={400}>
              Add phone number:
            </Text>
            <Field name='mobileNumber' component={TextBox} validate={[required]} />
          </MobileInput>
          <MobileCodeContainer>
            <Text size='14px' weight={400}>Enter verification code sent to your mobile phone:</Text>
            <FieldWrapper>
              <Field name='mobileCode' component={TextBox} validate={[required]} />
              <MixedText>
                Didn't receive the code? { ui.smsCodeSent ? <a>Sent!</a> : <a onClick={this.sendEmailCode}>Resend</a> }
              </MixedText>
            </FieldWrapper>
          </MobileCodeContainer>
          <ButtonWrapper>
            <Button type='submit' nature='primary' fullwidth disabled={invalid}>
              Continue
            </Button>
          </ButtonWrapper>
        </Wrapper>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  mobileNumber: formValueSelector('sfoxCreateVerifyEmail')(state, 'mobileNumber'),
  mobileCode: formValueSelector('sfoxCreateVerifyEmail')(state, 'mobileCode')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false } })
)

export default reduxForm({ form: 'sfoxCreateVerifyEmail' })(enhance(VerifyEmail))
