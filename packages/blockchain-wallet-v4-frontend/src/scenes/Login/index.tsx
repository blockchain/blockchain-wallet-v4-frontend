import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector, getFormMeta } from 'redux-form'

import { crypto as wCrypto } from 'blockchain-wallet-v4/src'
import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { isEmail, isGuid } from 'services/forms'

import Login from './template'

class LoginContainer extends React.PureComponent<Props> {
  state = { useCode: true }

  componentDidMount() {
    this.props.middlewareActions.startSocket()
  }

  componentWillUnmount() {
    this.props.formActions.reset('login')
  }

  onSubmit = () => {
    const { code, guid, password } = this.props
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

  render() {
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
  authType: selectors.auth.getAuthType(state),
  code: formValueSelector('login')(state, 'code'),
  data: selectors.auth.getLogin(state),
  formMeta: getFormMeta('login')(state),
  goals: selectors.goals.getGoals(state),
  guid: formValueSelector('login')(state, 'guid'),
  isGuidEmailAddress: isEmail(formValueSelector('login')(state, 'guid')),
  isGuidValid: isGuid(formValueSelector('login')(state, 'guid')),
  lastGuid: selectors.cache.getLastGuid(state),
  password: formValueSelector('login')(state, 'password'),
  phonePubKey: selectors.cache.getPhonePubkey(state),
  // TODO where should we put this logic to build the QR code data?
  // TODO the QR code should read some error if we aren't connected to WS
  qrData: selectors.cache.getChannelPrivKey(state)
    ? JSON.stringify({
        type: 'login_wallet',
        channelId: selectors.cache.getChannelChannelId(state),
        pubkey: wCrypto
          .derivePubFromPriv(
            Buffer.from(selectors.cache.getChannelPrivKey(state), 'hex')
          )
          .toString('hex')
      })
    : '',
  showMobileAuth: selectors.core.walletOptions
    .getMobileAuthFlag(state)
    .getOrElse(false) as boolean,
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  middlewareActions: bindActionCreators(actions.ws, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  location: { pathname: string }
}

export default connector(LoginContainer)
