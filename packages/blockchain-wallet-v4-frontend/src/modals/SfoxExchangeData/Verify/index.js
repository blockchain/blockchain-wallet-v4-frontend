import React, { Component } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import Verify from './template'
import { actions } from 'data'

class VerifyContainer extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('handleSubmit', this.props)
  }

  render () {
    return <Verify
      handleSubmit={this.handleSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
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
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(VerifyContainer)
