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
import {
  required,
  normalizePhone,
  validMobileNumber
} from 'services/FormHelper'
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

const MobileInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const MobileCodeContainer = MobileInput.extend`
  margin-top: 25px;
`
const VerifyMobileForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
    height: 100vh;
  `};
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
    this.props.sfoxFrontendActions.sfoxNotAsked()
  }

  componentDidUpdate (prevProps) {
    if (this.props.smsVerified && !prevProps.smsVerified) {
      this.props.updateUI({ create: 'create_account' })
    }
    if (this.props.smsVerified && !this.props.editVerifiedMobile) {
      this.props.updateUI({ create: 'create_account' })
    }
  }

  updateMobileNumber () {
    this.props.updateUI({ create: 'enter_mobile_code' })
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  resendCode () {
    this.props.updateUI({ smsCodeResent: true })
    this.props.settingsActions.resendMobile(this.props.mobileNumber)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create !== 'enter_mobile_code') {
      this.props.settingsActions.clearMobileFailure()
      this.updateMobileNumber()
    } else {
      this.props.settingsActions.verifyMobile(this.props.mobileCode)
    }
  }

  render () {
    const {
      ui,
      mobileCode,
      mobileNumber,
      mobileVerifiedError,
      countryCode,
      smsNumber
    } = this.props

    let smsHelper = () => {
      switch (true) {
        case mobileVerifiedError:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.mobile.helper.error'
              defaultMessage="That code doesn't match. {resend} or {changeNumber}."
              values={{
                resend: <a onClick={this.resendCode}>Resend</a>,
                changeNumber: (
                  <a
                    onClick={() =>
                      this.props.updateUI({ create: 'change_mobile' })
                    }
                  >
                    change number
                  </a>
                )
              }}
            />
          )
        case ui.smsCodeResent:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.mobile.helper.sentanothercode'
              defaultMessage='Another code has been sent!'
            />
          )
        case !ui.smsCodeResent:
          return (
            <FormattedMessage
              id='sfoxexchangedata.create.mobile.helper.didntreceive'
              defaultMessage="Didn't get our text? {resend}."
              values={{ resend: <a onClick={this.resendCode}>Resend</a> }}
            />
          )
      }
    }

    return (
      <VerifyMobileForm onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage
                id='sfoxexchangedata.create.verifymobile.partner.header.mobile'
                defaultMessage="What's Your Number?"
              />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage
                id='sfoxexchangedata.create.verifymobile.partner.subheader.mobile'
                defaultMessage="Confirming your phone number allows SFOX to secure your account. Don't worry, we won't use your number for anything other than sending your code."
              />
            </PartnerSubHeader>
            <MobileInput>
              <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                <FormattedMessage
                  id='sfoxexchangedata.create.mobile.entermobilenumber'
                  defaultMessage='Enter your digits here:'
                />
              </Text>
              <Field
                name='mobileNumber'
                defaultValue={smsNumber}
                component={PhoneNumberBox}
                validate={[required, validMobileNumber]}
                normalize={normalizePhone}
                countryCode={countryCode}
                errorBottom
              />
              {ui.create === 'change_mobile' && (
                <Button
                  nature='primary'
                  type='submit'
                  disabled={!mobileNumber}
                  style={spacing('mt-15')}
                >
                  <FormattedMessage
                    id='sfoxexchangedata.create.mobile.sendmycode'
                    defaultMessage='Send My Code'
                  />
                </Button>
              )}
            </MobileInput>
            {ui.create === 'enter_mobile_code' && (
              <MobileCodeContainer>
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='sfoxexchangedata.create.mobile.entercode'
                    defaultMessage='Enter the code we just sent to your phone:'
                  />
                </Text>
                <Field
                  name='mobileCode'
                  component={TextBox}
                  validate={[required]}
                  errorBottom
                />
                <EmailHelper error={mobileVerifiedError}>
                  {smsHelper()}
                </EmailHelper>
              </MobileCodeContainer>
            )}
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            {ui.create !== 'enter_mobile_code' ? null : (
              <ButtonWrapper>
                <Button
                  type='submit'
                  nature='primary'
                  fullwidth
                  disabled={!mobileCode}
                >
                  <FormattedMessage
                    id='sfoxexchangedata.create.mobile.continue'
                    defaultMessage='Continue'
                  />
                </Button>
              </ButtonWrapper>
            )}
          </ColRightInner>
        </ColRight>
      </VerifyMobileForm>
    )
  }
}

const mapStateToProps = state => ({
  mobileNumber: formValueSelector('sfoxCreate')(state, 'mobileNumber'),
  mobileCode: formValueSelector('sfoxCreate')(state, 'mobileCode'),
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  countryCode: selectors.core.settings.getCountryCode(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({ state: { smsCodeResent: false } })
)

export default enhance(VerifyMobile)
