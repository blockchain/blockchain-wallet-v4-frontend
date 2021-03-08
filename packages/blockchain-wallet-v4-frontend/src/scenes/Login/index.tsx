import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { bindActionCreators } from 'redux'
import { formValueSelector, getFormMeta } from 'redux-form'

import { actions, selectors } from 'data'
import { isEmail, isGuid } from 'services/forms'
import Login from './template'

class LoginContainer extends React.PureComponent<Props> {
  state = { useCode: true }

  componentWillUnmount () {
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
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  location: { pathname: string }
}

export default connector(LoginContainer)
