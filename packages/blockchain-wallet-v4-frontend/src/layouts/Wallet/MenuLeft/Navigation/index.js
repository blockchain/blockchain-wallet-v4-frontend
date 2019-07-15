import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { concat, prop } from 'ramda'

import { actions, selectors } from 'data'
import Navigation from './template'

class NavigationContainer extends React.PureComponent {
  render () {
    const {
      actions,
      domains,
      isPitAccountLinked,
      supportedCoins,
      ...props
    } = this.props
    return (
      <Navigation
        {...props}
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
        isPitAccountLinked={isPitAccountLinked}
        pitUrl={concat(prop('thePit', domains), '/trade')}
        supportedCoins={supportedCoins}
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
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
