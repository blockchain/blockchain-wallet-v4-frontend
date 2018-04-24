import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import Login from './template.js'
import { actions, selectors } from 'data'

class LoginContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.authType !== this.props.authType) this.props.updateUI({ busy: false })
  }

  onSubmit (event) {
    this.props.updateUI({ busy: true })
    event.preventDefault()
    const { guid, password, code } = this.props
    this.props.authActions.login(guid, password, code)
  }

  handleMobile () {
    this.props.modalActions.showModal('MobileLogin')
  }

  render () {
    let valid = localStorage.getItem('ls.guid') !== 'undefined'
    const guid = valid && JSON.parse(localStorage.getItem('ls.guid'))

    const { authType } = this.props

    return <Login initialValues={{ guid }} authType={authType} onSubmit={this.onSubmit} handleMobile={this.handleMobile} busy={this.props.ui.busy} />
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
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { busy: false } })
)
export default enhance(LoginContainer)
