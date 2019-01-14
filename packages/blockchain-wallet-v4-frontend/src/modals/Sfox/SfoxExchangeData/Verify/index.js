import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { path, equals } from 'ramda'
import { actions } from 'data'
import ui from 'redux-ui'
import Upload from '../Upload'
import Jumio from '../Jumio'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

import renderFaq from 'components/FaqDropdown'

import Address from './Address'
import Identity from './Identity'

const FaqWrapper = styled.div``

const faqQuestions = [
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.verify.address.helper1.question'
        defaultMessage='Why do you need this personal information?'
      />
    ),
    answer: (
      <FaqWrapper>
        <FormattedMessage
          id='scenes.buysell.sfoxsignup.verify.address.helper1.answer'
          defaultMessage='SFOX needs this information to verify your identity and to comply with government regulated anti-money laundering laws. To read more about how SFOX protects this information, please visit their'
        />
        <span>&nbsp;</span>
        <Link
          href='https://www.sfox.com/privacy.html'
          target='_blank'
          size='12px'
          weight={200}
        >
          <FormattedMessage
            id='scenes.buysell.sfoxsignup.verify.address.helper1.link'
            defaultMessage='privacy policy'
          />
        </Link>
        <FormattedMessage
          id='scenes.buysell.sfoxsignup.verify.address.helper1.answer2'
          defaultMessage='.'
        />
      </FaqWrapper>
    )
  },
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.verify.address.helper2.question'
        defaultMessage='Where is this information stored?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.verify.address.helper2.answer'
        defaultMessage='We know this information is personal. Don’t worry, it will be securely sent to SFOX and not stored in your Blockchain wallet.'
      />
    )
  }
]

class VerifyContainer extends Component {
  state = { viewSSN: false }

  componentDidUpdate (prevProps) {
    if (
      !equals(this.props.verificationError, prevProps.verificationError) &&
      prevProps.verificationError
    ) {
      this.props.updateUI({ busy: false })
    }
  }

  componentWillUnmount () {
    this.props.formActions.destroy('sfoxAddress')
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.updateUI({ busy: true })
    this.props.sfoxFrontendActions.setProfile(this.props.user)
  }

  handleReset = () => {
    this.props.updateUI({ busy: false })
    this.props.updateUI({ verify: 'address' })
    this.props.sfoxFrontendActions.setVerifyError(false)
    this.props.sfoxDataActions.refetchProfile()
  }

  render () {
    if (this.props.step === 'upload') return <Upload />
    if (this.props.step === 'jumio') return <Jumio />
    if (this.props.ui.verify === 'address')
      return <Address {...this.props} faqs={renderFaq(faqQuestions)} />
    if (this.props.ui.verify === 'identity')
      return (
        <Identity
          {...this.props}
          toggleSSN={() => this.setState({ viewSSN: !this.state.viewSSN })}
          viewSSN={this.state.viewSSN}
          faqs={renderFaq(faqQuestions)}
          handleSubmit={this.handleSubmit}
          handleReset={this.handleReset}
        />
      )
  }
}

const mapStateToProps = state => ({
  user: {
    firstName: formValueSelector('sfoxAddress')(state, 'firstName'),
    lastName: formValueSelector('sfoxAddress')(state, 'lastName'),
    ssn: formValueSelector('sfoxIdentity')(state, 'ssn'),
    dob: formValueSelector('sfoxIdentity')(state, 'dob'),
    address1: formValueSelector('sfoxAddress')(state, 'address1'),
    address2: formValueSelector('sfoxAddress')(state, 'address2'),
    city: formValueSelector('sfoxAddress')(state, 'city'),
    state: formValueSelector('sfoxAddress')(state, 'state'),
    zipcode: formValueSelector('sfoxAddress')(state, 'zipcode')
  },
  verificationError: path(['sfoxSignup', 'verifyError'], state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({ state: { verify: 'address', error: false, busy: false } })
)

export default enhance(VerifyContainer)
