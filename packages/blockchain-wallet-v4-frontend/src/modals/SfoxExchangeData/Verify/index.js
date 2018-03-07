import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import Verify from './template'
import { actions } from 'data'
import { path } from 'ramda'
import ui from 'redux-ui'

class VerifyContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.verificationError) {
      this.props.updateUI({ error: true })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.updateUI({ error: false })
    this.props.sfoxFrontendActions.setProfile(this.props.user)
  }

  render () {
    return <Verify
      {...this.props}
      handleSubmit={this.handleSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
  user: {
    firstName: formValueSelector('sfoxVerify')(state, 'firstName'),
    middleName: formValueSelector('sfoxVerify')(state, 'middleName'),
    lastName: formValueSelector('sfoxVerify')(state, 'lastName'),
    ssn: formValueSelector('sfoxVerify')(state, 'ssn'),
    dob: formValueSelector('sfoxVerify')(state, 'dob'),
    address1: formValueSelector('sfoxVerify')(state, 'address1'),
    address2: formValueSelector('sfoxVerify')(state, 'address2'),
    city: formValueSelector('sfoxVerify')(state, 'city'),
    state: formValueSelector('sfoxVerify')(state, 'state'),
    zipcode: formValueSelector('sfoxVerify')(state, 'zipcode')
  },
  verificationError: path(['sfoxSignup', 'verifyError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { error: false } })
)

export default enhance(VerifyContainer)
