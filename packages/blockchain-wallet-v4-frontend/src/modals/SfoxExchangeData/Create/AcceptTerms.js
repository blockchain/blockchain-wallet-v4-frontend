import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { path } from 'ramda'
import { Field } from 'redux-form'
import { actions, selectors } from 'data'
import { CheckBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { Button, HeartbeatLoader, Text, Link, Icon } from 'blockchain-info-components'
import Helper from 'components/BuySell/FAQ'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'
import { Remote } from 'blockchain-wallet-v4/src'
import Terms from 'components/Terms'

const checkboxShouldBeChecked = value => value ? undefined : 'You must agree to the terms and conditions'

const helpers = [
  {
    question: <FormattedMessage id='scenes.sfoxsignup.acceptterms.helper1.question' defaultMessage='What is SFOX?' />,
    answer: <FormattedMessage id='scenes.sfoxsignup.acceptterms.helper1.answer' defaultMessage='SFOX (San Francisco Open Exchange) is a trading platform we’ve partnered with to bring you a harmonious buy & sell experience in your Blockchain wallet.' />
  },
  {
    question: <FormattedMessage id='scenes.sfoxsignup.acceptterms.helper2.question' defaultMessage='How do I change my email address, phone number, or other personal information?' />,
    answer: <FormattedMessage id='scenes.sfoxsignup.acceptterms.helper2.answer' defaultMessage='Personal information can be changed by submitting a request to support@sfox.com. Make sure you mention Blockchain in the subject and include the information you want to change. Changing your email or phone number within your Blockchain wallet will not impact your SFOX account.' />
  }
]

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  font-weight: 400;
  a {
    color: ${props => props.theme['brand-secondary']};
    text-decoration: none;
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
const InlineTextWrapper = styled.div`
  & > * {
    display: inline-block;
    margin-right: 3px;
  }
`

class AcceptTerms extends Component {
  constructor (props) {
    super(props)
    this.state = { acceptedTerms: false }

    this.handleSignup = this.handleSignup.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const error = Remote.of(nextProps.sfoxSignupStatus)
    if (error.data.error && error.data.error.message === 'user is already registered') this.props.updateUI({ uniqueEmail: false })
  }

  handleSignup (e) {
    e.preventDefault()
    this.props.sfoxFrontendActions.sfoxNotAsked()
    this.props.sfoxFrontendActions.sfoxSignup()
  }

  render () {
    const { busy, error } = this.props.sfoxSignupStatus.cata({
      Success: () => ({ busy: false }),
      Failure: (error) => ({ busy: false, error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ busy: false })
    })

    const { invalid, email, smsNumber, editEmail, editMobile, emailVerified, smsVerified, sfoxFrontendActions } = this.props
    const { sfoxNotAsked } = sfoxFrontendActions

    const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)

    return (
      <Form onSubmit={this.handleSignup}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.header' defaultMessage='Create Your Account' />
            </PartnerHeader>
            <PartnerSubHeader>
              <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.subheader' defaultMessage="Your buy and sell experience is being streamlined. We've teamed up with SFOX to make your dreams of simply managing funds a reality." />
            </PartnerSubHeader>
            <PartnerSubHeader style={spacing('mt-10')}>
              <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.subheader2' defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address and phone number." />
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
                    { emailVerified ? <Icon name='checkmark-in-circle-filled' color='success' size='20px' /> : null }
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
                    { smsVerified ? <Icon name='checkmark-in-circle-filled' color='success' size='20px' /> : null }
                  </IconContainer>
                </VerifiedContainer>
              </FieldContainer>
            </FieldsContainer>
            <AcceptTermsContainer>
              <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
                <Terms company='sfox' />
              </Field>
            </AcceptTermsContainer>
          </InputWrapper>
        </ColLeft>
        <ColRight>
          <ColRightInner>
            <ButtonWrapper>
              <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid || busy || !smsNumber || !email || error}>
                {
                  busy
                    ? <HeartbeatLoader height='20px' width='20px' color='white' />
                    : <span>Continue</span>
                }
              </Button>
            </ButtonWrapper>
            <ErrorWrapper>
              {
                error && error.message.toLowerCase() === 'user is already registered'
                  ? <InlineTextWrapper>
                    <Text size='12px' color='error' weight={300} >
                      <FormattedMessage id='sfoxexchangedata.create.accept.error' defaultMessage='Unfortunately this email is being used for another account.' />
                    </Text>
                    <Link size='12px' weight={300} onClick={() => { sfoxNotAsked(); this.props.updateUI({ create: 'change_email' }) }} >
                      <FormattedMessage id='clickhere' defaultMessage='Click here' />
                    </Link>
                    <Text size='12px' weight={300} color='error'>
                      <FormattedMessage id='sfoxexchangedata.create.accept.tochangeit' defaultMessage=' to change it.' />
                    </Text>
                  </InlineTextWrapper>
                  : error
                    ? <InlineTextWrapper>
                      <Text size='12px' color='error' weight={300}>
                        <FormattedMessage id='sfoxexchangedata.create.accept.unknownError' defaultMessage="We're sorry, but something unexpected went wrong. Please " />
                      </Text>
                      <Link size='12px' weight={300} onClick={() => sfoxNotAsked()}>
                        <FormattedMessage id='tryagain' defaultMessage='try again' />
                      </Link>
                      <Text size='12px' color='error' weight={300}>
                        <FormattedMessage id='or' defaultMessage='or' />
                      </Text>
                      <Link target='_blank' href='https://support.blockchain.com' size='12px' weight={300}>
                        <FormattedMessage id='contactsupport' defaultMessage='contact support.' />
                      </Link>
                    </InlineTextWrapper>
                    : null
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
  invalid: PropTypes.bool,
  ui: PropTypes.object,
  email: PropTypes.string.isRequired,
  smsNumber: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  sfoxSignupStatus: path(['sfoxSignup', 'sfoxBusy'], state)
})

const mapDispatchToProps = (dispatch) => ({
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(AcceptTerms)
