import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { concat, prop } from 'ramda'

import { actions, model, selectors } from 'data'
import Navigation from './template'

const { PIT_EVENTS } = model.analytics

class NavigationContainer extends React.PureComponent {
  render () {
    const {
      actions,
      analyticsActions,
      domains,
      isPitAccountLinked,
      isInvitedToPitSidenav,
      supportedCoins,
      ...props
    } = this.props
    return (
      <Navigation
        {...props}
        onClickPitSideNavLink={() =>
          analyticsActions.logEvent(PIT_EVENTS.SIDE_NAV)
        }
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
        isPitAccountLinked={isPitAccountLinked}
        isInvitedToPitSidenav={isInvitedToPitSidenav}
        pitUrl={concat(prop('thePit', domains), '/trade')}
        supportedCoins={supportedCoins}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({}),
  isInvitedToPitSidenav: selectors.modules.profile
    .isInvitedToPitSidenav(state)
    .getOrElse(false),
  isPitAccountLinked: selectors.modules.profile
    .isPitAccountLinked(state)
    .getOrElse(false),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
