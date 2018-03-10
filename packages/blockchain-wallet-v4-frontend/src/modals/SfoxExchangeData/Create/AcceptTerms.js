import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { path } from 'ramda'
import { Field } from 'redux-form'
import { actions, selectors } from 'data'
import { CheckBox } from 'components/Form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'

const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

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
const ButtonWrapper = styled.div`
  margin-top: 25px;
`
const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  a {
    color: ${props => props.theme['brand-secondary']}
  }
`
const ErrorWrapper = styled.div`
  margin-top: 5px;
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']}
  }
`

class AcceptTerms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      busy: false,
      acceptedTerms: false
    }

    this.handleSignup = this.handleSignup.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.signupError) {
      this.setState({ busy: false })
      this.props.updateUI({ uniqueEmail: false })
    }
  }

  handleSignup (e) {
    e.preventDefault()
    this.setState({ busy: true })
    this.props.sfoxFrontendActions.sfoxSignup()
  }

  render () {
    const { busy } = this.state
    const { invalid, email, smsNumber, signupError } = this.props

    return (
      <Form onSubmit={this.handleSignup}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='sfoxexchangedata.create.verifyemail.partner.header.enter_email_code' defaultMessage='Blockchain + SFOX' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedHTMLMessage id='sfoxexchangedata.create.accept.partner.header.enter_email_code' defaultMessage='Thank you for verifying your email ({email}) and phone number ({mobile})! Please accept the terms and conditions to create your SFOX account.' values={{email: email, mobile: smsNumber}} />
            </PartnerSubHeader>
            <AcceptTermsContainer>
              <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
                <FormattedHTMLMessage id='sfoxexchangedata.create.accept.terms' defaultMessage="I accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>." />
              </Field>
            </AcceptTermsContainer>
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ButtonWrapper>
            <Button type='submit' nature='primary' fullwidth disabled={invalid || busy || signupError}>
              {
                !busy
                  ? <span>Continue</span>
                  : <HeartbeatLoader height='20px' width='20px' color='white' />
              }
            </Button>
          </ButtonWrapper>
          <ErrorWrapper>
            {
              signupError && <Text size='12px' color='error' weight={300} onClick={() => this.props.updateUI({ create: 'change_email' })}>
                <FormattedHTMLMessage id='sfoxexchangedata.create.accept.error' defaultMessage='Unfortunately this email is being used for another account. <a>Click here</a> to change it.' />
              </Text>
            }
          </ErrorWrapper>
        </ColRight>
      </Form>
    )
  }
}

AcceptTerms.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  ui: PropTypes.object,
  email: PropTypes.string.isRequired,
  smsNumber: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  signupError: path(['sfoxSignup', 'signupError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(AcceptTerms)
