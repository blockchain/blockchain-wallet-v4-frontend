import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Redirect } from 'react-router-dom'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent {
  componentWillMount () {
    this.props.settingsActions.fetchSettings()
    this.props.kvStoreWhatsNewActions.fetchMetadataWhatsnew()
    this.props.kvStoreShapeshiftActions.fetchMetadataShapeshift()
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
  }

  // Language must also be set on settings (wallet get-info)
  // if it differs from language preferences (local storage)
  componentDidUpdate (prevProps) {
    if (!Remote.Success.is(prevProps.payloadLanguage) && Remote.Success.is(this.props.payloadLanguage)) {
      if (this.props.language !== this.props.payloadLanguage.getOrElse()) {
        this.props.moduleSettingsActions.updateLanguage(this.props.language)
      }
    }
  }

  render () {
    const { isAuthenticated, path, computedMatch, component: Component } = this.props

    return isAuthenticated
      ? <Route path={path} render={props => (
        <WalletLayout location={props.location}>
          <Component computedMatch={computedMatch} />
        </WalletLayout>
      )} />
      : <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  }
}

const mapStateToProps = (state) => ({
  language: selectors.preferences.getLanguage(state),
  isAuthenticated: selectors.auth.isAuthenticated(state),
  payloadLanguage: selectors.core.settings.getLanguage(state)
})

const mapDispatchToProps = (dispatch) => ({
  kvStoreShapeshiftActions: bindActionCreators(actions.core.kvStore.shapeShift, dispatch),
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  kvStoreWhatsNewActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch),
  moduleSettingsActions: bindActionCreators(actions.modules.settings, dispatch),
  optionsActions: bindActionCreators(actions.core.walletOptions, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletLayoutContainer)
