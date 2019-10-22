import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { concat, prop } from 'ramda'
import { STATUS } from 'react-joyride/lib'

import { actions, selectors } from 'data'
import Navigation from './template'

class NavigationContainer extends React.PureComponent {
  handlePitTourCallbacks = (data, e) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      this.props.preferencesActions.hideThePitPulse()
    }
  }

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
        pitUrl={concat(prop('thePit', domains), '/trade')}
        handlePitTourCallbacks={this.handlePitTourCallbacks}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({}),
  isPitAccountLinked: selectors.modules.profile
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
