import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { formValueSelector, Field } from 'redux-form'

import { PhoneNumberBox, TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'
import Helper from './helpers.js'
import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ColRightInner } from '../styled'

const MobileInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const MobileCodeContainer = MobileInput.extend`
  margin-top: 25px;
`
const MixedText = styled.span`
  margin-top: 10px;
  font-size: 12px;
  color: ${props => props.theme['gray-3']};
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.smsVerified) {
      this.props.updateUI({ create: 'create_account' })
    }
  }

  updateMobileNumber () {
    this.props.updateUI({ create: 'enter_mobile_code' })
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  resendCode () {
    this.props.updateUI({ smsCodeResent: true })
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create !== 'enter_mobile_code') {
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
      <Form onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='sfoxexchangedata.create.verifymobile.partner.header.mobile' defaultMessage='Confirm Phone Number' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='sfoxexchangedata.create.verifymobile.partner.subheader.mobile' defaultMessage='Please take a moment to verify your phone number. This helps us confirm your identity and secure your account.' />
            </PartnerSubHeader>
            <MobileInput>
              <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='sfoxexchangedata.create.mobile.number' defaultMessage='Add Phone Number:' />
              </Text>
              <Field name='mobileNumber' defaultValue={this.props.smsNumber} component={PhoneNumberBox} validate={[required]} />
            </MobileInput>
            {
              ui.create === 'enter_mobile_code' && <MobileCodeContainer>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.create.mobile.entercode' defaultMessage='Enter Verification Code:' />
                </Text>
                <Field name='mobileCode' component={TextBox} validate={[required]} />
                <MixedText>
                  { smsHelper() }
                </MixedText>
              </MobileCodeContainer>
            }
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            {
              ui.create === 'enter_mobile_code' && <ButtonWrapper>
                <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid}>
                  Continue
                </Button>
              </ButtonWrapper>
            }
            {
              ui.create !== 'enter_mobile_code' && <ButtonWrapper>
                <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='sfoxexchangedata.create.mobile.textcode' defaultMessage='Text Verification Code' />
                </Button>
              </ButtonWrapper>
            }
            <Helper />
          </ColRightInner>
        </ColRight>
      </Form>
    )
  }
}

const mapStateToProps = (state) => ({
  mobileNumber: formValueSelector('sfoxCreate')(state, 'mobileNumber'),
  mobileCode: formValueSelector('sfoxCreate')(state, 'mobileCode'),
  smsNumber: selectors.core.settings.getSmsNumber(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeResent: false } })
)

export default enhance(VerifyMobile)
