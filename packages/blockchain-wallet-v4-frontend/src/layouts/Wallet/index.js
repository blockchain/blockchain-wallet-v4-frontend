import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { Route, Redirect } from 'react-router-dom'
import ui from 'redux-ui'
import { reset } from 'redux-form'

import { actions, selectors } from 'data'
import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent {
  componentWillMount () {
    this.props.settingsActions.fetchSettings()
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
    this.props.kvStoreWhatsnewActions.fetchMetadataWhatsnew()
    this.props.kvStoreShapeshiftActions.fetchMetadataShapeshift()
  }

  render () {
    const { ui, updateUI, canTrade, isAuthenticated, path, computedMatch, component: Component } = this.props
    const partner = canTrade.cata({ Success: (val) => val, Failure: () => false, Loading: () => false, NotAsked: () => false })

    return isAuthenticated
      ? <Route path={path} render={props => (
        <WalletLayout
          partner={partner}
          location={props.location}
          menuLeftToggled={ui.menuLeftToggled}
          trayRightOpen={ui.trayRightOpen}
          trayRightContent={ui.trayRightContent}
          handleTrayRightToggle={(content, fromClickOutside) => {
            this.props.resetFaqForm()
            if (fromClickOutside) {
              updateUI({ trayRightOpen: false })
            } else if (content && ui.trayRightOpen && ui.trayRightContent !== content) {
              updateUI({ trayRightContent: content })
            } else if (ui.trayRightOpen && !content) {
              updateUI({ trayRightOpen: false })
            } else {
              updateUI({ trayRightOpen: !ui.trayRightOpen, trayRightContent: content })
            }
          }}
          handleToggleMenuLeft={() => updateUI({ menuLeftToggled: !ui.menuLeftToggled })}
          handleCloseMenuLeft={() => updateUI({ menuLeftToggled: false })}>
          <Component computedMatch={computedMatch} />
        </WalletLayout>
      )} />
      : <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  }
}

const mapStateToProps = (state) => ({
  canTrade: selectors.exchange.getCanTrade(state),
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  resetFaqForm: () => dispatch(reset('faq')),
  kvStoreShapeshiftActions: bindActionCreators(actions.core.kvStore.shapeShift, dispatch),
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  kvStoreWhatsnewActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch),
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch),
  optionsActions: bindActionCreators(actions.core.walletOptions, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({
    key: 'WalletLayout',
    persist: true,
    state: {
      menuLeftToggled: false,
      trayRightOpen: false,
      trayRightContent: ''
    }
  })
)

export default enhance(WalletLayoutContainer)
