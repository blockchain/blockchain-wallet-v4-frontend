import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Redirect } from 'react-router-dom'

import { actions, selectors } from 'data'
import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent {
  componentWillMount () {
    this.props.settingsActions.fetchSettings()
    this.props.kvStoreWhatsNewActions.fetchMetadataWhatsnew()
    this.props.kvStoreShapeshiftActions.fetchMetadataShapeshift()
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
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
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  kvStoreShapeshiftActions: bindActionCreators(actions.core.kvStore.shapeShift, dispatch),
  kvStoreWhatsNewActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch),
  moduleSettingsActions: bindActionCreators(actions.modules.settings, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletLayoutContainer)
