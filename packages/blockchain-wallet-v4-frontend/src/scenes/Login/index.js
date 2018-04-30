import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { isNil, not } from 'ramda'

import Login from './template.js'
import { actions, selectors } from 'data'

class LoginContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { useCode: true }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleCode = this.handleCode.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.authType !== this.props.authType) this.props.updateUI({ busy: false })
    if (prevProps.error !== this.props.error) this.props.updateUI({ busy: false })
  }

  handleCode (val) {
    this.setState({ useCode: val })
  }

  onSubmit (event) {
    this.props.authActions.clearError()
    this.props.updateUI({ busy: true })
    event.preventDefault()
    const { useCode } = this.state
    const { guid, password, code } = this.props
    const auth = useCode ? code && code.toUpperCase() : undefined

    this.props.authActions.login(guid, password, auth)
  }

  handleMobile () {
    this.props.modalActions.showModal('MobileLogin')
  }

  render () {
    const { authType, lastGuid } = this.props
    const loginProps = {
      authType,
      onSubmit: this.onSubmit,
      busy: this.props.ui.busy,
      handleCode: this.handleCode,
      loginError: this.props.error,
      handleMobile: this.handleMobile
    }

    return lastGuid
      ? <Login {...this.props} initialValues={{ guid: lastGuid }} {...loginProps} />
      : <Login {...this.props} {...loginProps} />
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('login')(state, 'guid'),
  password: formValueSelector('login')(state, 'password'),
  code: formValueSelector('login')(state, 'code'),
  authType: selectors.auth.getAuthType(state),
  error: selectors.auth.getError(state),
  lastGuid: selectors.cache.getLastGuid(state)
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
