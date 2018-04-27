import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

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

  handleCode (val) {
    this.setState({ useCode: val })
  }

  onSubmit (event) {
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
    const valid = localStorage.getItem('ls.guid') !== 'undefined'
    const guid = valid && JSON.parse(localStorage.getItem('ls.guid'))
    const { authType, data } = this.props

    const { busy, error } = data.cata({
      Success: () => ({ error: null, busy: false }),
      Failure: (val) => ({ error: val.err, busy: false }),
      Loading: () => ({ error: null, busy: true }),
      NotAsked: () => ({ error: null, busy: false })
    })

    return <Login {...this.props}
      busy={busy}
      loginError={error}
      initialValues={{ guid }}
      authType={authType}
      onSubmit={this.onSubmit}
      handleCode={this.handleCode}
      handleMobile={this.handleMobile}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('login')(state, 'guid'),
  password: formValueSelector('login')(state, 'password'),
  code: formValueSelector('login')(state, 'code'),
  authType: selectors.auth.getAuthType(state),
  data: selectors.auth.getLogin(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
