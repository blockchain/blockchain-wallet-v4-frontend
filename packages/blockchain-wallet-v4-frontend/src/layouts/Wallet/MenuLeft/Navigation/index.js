import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { concat, prop } from 'ramda'
import { STATUS } from 'react-joyride/lib'

import { actions, model, selectors } from 'data'
import Navigation from './template'

const { PIT_EVENTS } = model.analytics

class NavigationContainer extends React.PureComponent {
  state = { hasRanPitTour: false, tourRunning: false }

  handleTourCallbacks = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      this.setState({ tourRunning: false, hasRanPitTour: true })
    }
  }

  render () {
    const {
      actions,
      analyticsActions,
      domains,
      isPitAccountLinked,
      isInvitedToPitSidenav,
      supportedCoins,
      routerActions,
      ...props
    } = this.props

    return (
      <Navigation
        {...props}
        onClickPitSideNavLink={isTour => {
          if (isTour) this.setState({ hasRanPitTour: true })
          analyticsActions.logEvent(PIT_EVENTS.SIDE_NAV)
        }}
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
        isPitAccountLinked={isPitAccountLinked}
        isInvitedToPitSidenav={isInvitedToPitSidenav}
        pitUrl={concat(prop('thePit', domains), '/trade')}
        supportedCoins={supportedCoins}
        hasRanPitTour={this.state.hasRanPitTour}
        tourRunning={this.state.tourRunning}
        startTour={() => this.setState({ tourRunning: true })}
        handleTourCallbacks={this.handleTourCallbacks}
        routeToPit={() => {
          this.setState({ tourRunning: false, hasRanPitTour: true })
          routerActions.push('/thepit')
        }}
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
