import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Login from './template.js'
import { actions, selectors } from 'data'

class LoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
  }

  onSubmit (event) {
    event.preventDefault()
    const { guid, password, code } = this.props
    const upperCode = code && code.toUpperCase()
    this.props.authActions.login(guid, password, upperCode)
  }

  handleMobile () {
    this.props.modalActions.showModal('MobileLogin')
  }

  render () {
    const { authType } = this.props
    return <Login authType={authType} onSubmit={this.onSubmit} handleMobile={this.handleMobile} />
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('login')(state, 'guid'),
  password: formValueSelector('login')(state, 'password'),
  code: formValueSelector('login')(state, 'code'),
  authType: selectors.auth.getAuthType(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps)
)
export default enhance(LoginContainer)
