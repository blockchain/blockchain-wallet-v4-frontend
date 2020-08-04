import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { formValueSelector, getFormMeta } from 'redux-form'
import { isEmail, isGuid } from '../../services/ValidationHelper'
import { crypto as wCrypto } from 'blockchain-wallet-v4/src'
import Login from './template'
import React from 'react'

class LoginContainer extends React.PureComponent<Props> {
  state = { useCode: true }

  componentDidMount () {
    this.props.middlewareActions.startSocket()
  }

  componentWillUnmount () {
    this.props.formActions.reset('login')
  }

  onSubmit = () => {
    const { guid, password, code } = this.props
    let auth = code
    // only uppercase if authType is not Yubikey
    if (auth && this.props.authType !== 1) {
      auth = auth.toUpperCase()
    }
    this.props.authActions.login(guid, password, auth)
  }

  handleSmsResend = () => {
    this.props.authActions.resendSmsCode(this.props.guid)
  }

  render () {
    const { authType, data, lastGuid } = this.props

    const { busy, error } = data.cata({
      Success: () => ({ error: null, busy: false }),
      Failure: val => ({ error: val.err, busy: false }),
      Loading: () => ({ error: null, busy: true }),
      NotAsked: () => ({ error: null, busy: false })
    })

    const loginProps = {
      busy,
      authType,
      loginError: error,
      onSubmit: this.onSubmit,
      handleSmsResend: this.handleSmsResend
    }

    const path =
      this.props.location.pathname && this.props.location.pathname.split('/')[2]
    const guid = (isGuid(path) && path) || lastGuid

    return guid ? (
      // @ts-ignore
      <Login {...this.props} {...loginProps} initialValues={{ guid }} />
    ) : (
      <Login {...this.props} {...loginProps} />
    )
  }
}

const mapStateToProps = state => ({
  code: formValueSelector('login')(state, 'code'),
  guid: formValueSelector('login')(state, 'guid'),
  password: formValueSelector('login')(state, 'password'),
  formMeta: getFormMeta('login')(state),
  authType: selectors.auth.getAuthType(state),
  lastGuid: selectors.cache.getLastGuid(state),
  goals: selectors.goals.getGoals(state),
  data: selectors.auth.getLogin(state),
  isGuidValid: isGuid(formValueSelector('login')(state, 'guid')),
  isGuidEmailAddress: isEmail(formValueSelector('login')(state, 'guid')),
  // TODO where should we put this logic to build the QR code data?
  // TODO the QR code should read some error if we aren't connected to WS
  qr_data: selectors.cache.getChannelPrivKey(state)
    ? JSON.stringify({
        type: 'login_wallet',
        ruid: selectors.cache.getChannelRuid(state),
        pubkey: wCrypto
          .derivePubFromPriv(
            Buffer.from(selectors.cache.getChannelPrivKey(state), 'hex')
          )
          .toString('hex')
      })
    : ''
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  middlewareActions: bindActionCreators(actions.ws, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  location: { pathname: string }
}

export default connector(LoginContainer)
