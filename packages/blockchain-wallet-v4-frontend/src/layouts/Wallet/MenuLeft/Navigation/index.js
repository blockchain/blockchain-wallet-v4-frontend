import { bindActionCreators, compose } from 'redux'
import { concat, prop } from 'ramda'
import { connect } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import Navigation from './template'

class NavigationContainer extends React.PureComponent {
  render () {
    const {
      actions,
      analyticsActions,
      domains,
      userKYCState,
      ...props
    } = this.props

    return (
      <Navigation
        {...props}
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
        exchangeUrl={concat(prop('thePit', domains), '/trade')}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({}),
  isExchangeAccountLinked: selectors.modules.profile
    .isPitAccountLinked(state)
    .getOrElse(false),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
