import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { path, equals } from 'ramda'
import { actions } from 'data'
import ui from 'redux-ui'

import Address from './Address'
import Identity from './Identity'

class VerifyContainer extends Component {
  constructor (props) {
    super(props)
    this.handleReset = this.handleReset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.verificationError, nextProps.verificationError) && nextProps.verificationError) {
      this.props.updateUI({ busy: false })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.updateUI({ busy: true })
    this.props.sfoxFrontendActions.setProfile(this.props.user)
  }

  handleReset () {
    this.props.updateUI({ busy: false })
    this.props.updateUI({ verify: 'address' })
    this.props.sfoxFrontendActions.setVerifyError(false)
  }

  render () {
    return this.props.ui.verify === 'address'
      ? <Address {...this.props} />
      : <Identity {...this.props} handleSubmit={this.handleSubmit} handleReset={this.handleReset} />
  }
}

const mapStateToProps = (state) => ({
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

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { verify: 'address', error: false, busy: false } })
)

export default enhance(VerifyContainer)
