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
import { Button, HeartbeatLoader, Text, Link, Icon } from 'blockchain-info-components'
import Helper from 'components/BuySell/FAQ'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'

const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

const helpers = [
  {
    question: <FormattedMessage id='sfoxsignup.create.helper1.question' defaultMessage='What is SFOX?' />,
    answer: <FormattedMessage id='sfoxsignup.create.helper1.answer' defaultMessage='Answer placeholder' />
  }
]

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  font-weight: 400;
  a {
    color: ${props => props.theme['brand-secondary']}
  }
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const VerifiedContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const FieldBox = styled.div`
  border: 1px solid #DDDDDD;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

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
    const { invalid, email, smsNumber, signupError, editEmail, editMobile } = this.props

    const faqHelper = () => helpers.map(el => <Helper question={el.question} answer={el.answer} />)

    return (
      <Form onSubmit={this.handleSignup}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.header' defaultMessage='Create Your Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedHTMLMessage id='sfoxexchangedata.create.createaccount.partner.subheader' defaultMessage="Your buy and sell experience is being streamlined. We've teamed up with SFOX to make your dreams of simply managing funds a reality." />
            </PartnerSubHeader>
            <PartnerSubHeader style={spacing('mt-10')}>
              <FormattedHTMLMessage id='sfoxexchangedata.create.createaccount.partner.subheader2' defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address and phone number." />
            </PartnerSubHeader>
            <FieldsContainer>
              <FieldContainer>
                <Text size='14px' style={spacing('mb-10')}>
                  <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.verifiedemail' defaultMessage='Verified Email Address' />
                </Text>
                <VerifiedContainer>
                  <FieldBox>
                    <Text size='14px' weight={300}>
                      { email }
                    </Text>
                    <Link onClick={editEmail} size='14px' weight={300}>
                      <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.edit' defaultMessage='edit' />
                    </Link>
                  </FieldBox>
                  <IconContainer>
                    <Icon name='checkmark-in-circle-filled' color='success' size='20px' />
                  </IconContainer>
                </VerifiedContainer>
              </FieldContainer>
              <FieldContainer>
                <Text size='14px' style={spacing('mb-10')}>
                  <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.verifiedmobile' defaultMessage='Verified Phone Number' />
                </Text>
                <VerifiedContainer>
                  <FieldBox>
                    <Text size='14px' weight={300}>
                      { smsNumber }
                    </Text>
                    <Link onClick={editMobile} size='14px' weight={300}>
                      <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.edit' defaultMessage='edit' />
                    </Link>
                  </FieldBox>
                  <IconContainer>
                    <Icon name='checkmark-in-circle-filled' color='success' size='20px' />
                  </IconContainer>
                </VerifiedContainer>
              </FieldContainer>
            </FieldsContainer>
            <AcceptTermsContainer>
              <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
                <FormattedHTMLMessage id='sfoxexchangedata.create.accept.terms' defaultMessage="The legal stuff: Accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>." />
              </Field>
            </AcceptTermsContainer>
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid || busy || signupError}>
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
            { faqHelper() }
          </ColRightInner>
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
