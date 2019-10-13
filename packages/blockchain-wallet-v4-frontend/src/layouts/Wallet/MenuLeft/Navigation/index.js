import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { concat, equals, not, prop } from 'ramda'
import { STATUS } from 'react-joyride/lib'

import { actions, model, selectors } from 'data'
import Navigation from './template'
const { NONE, REJECTED } = model.profile.KYC_STATES

const { PIT_EVENTS } = model.analytics

class NavigationContainer extends React.PureComponent {
  state = { hasRanPitTour: false }

  handleTourCallbacks = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      this.setState({ hasRanPitTour: true })
    }
  }

  render () {
    const {
      actions,
      analyticsActions,
      domains,
      isPitAccountLinked,
      routerActions,
      supportedCoins,
      userKycState,
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
        pitUrl={concat(prop('thePit', domains), '/trade')}
        supportedCoins={supportedCoins}
        hasRanPitTour={this.state.hasRanPitTour}
        handleTourCallbacks={this.handleTourCallbacks}
        routeToPit={() => {
          this.setState({ hasRanPitTour: true })
          routerActions.push('/thepit')
        }}
        userNonRejectAndHasntDoneKyc={
          equals(NONE, userKycState) && not(equals(REJECTED, userKycState))
        }
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
    .getOrFail(),
  userKycState: selectors.modules.profile.getUserKYCState(state).getOrElse(null)
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
