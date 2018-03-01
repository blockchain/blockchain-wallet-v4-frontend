import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import Verify from './template'
import { actions } from 'data'

class VerifyContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('verify handle submit', this.props.user)
    this.props.sfoxDataActions.setProfile(this.props.user)
  }

  render () {
    return <Verify
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
  }
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyContainer)
