import { actions, selectors } from 'data'
import { bindActionCreators, compose } from 'redux'
import { concat, prop } from 'ramda'
import { connect } from 'react-redux'
import { KycStateType } from 'data/types'
import { SupportedCoinsType } from 'core/types'
import Navigation from './template'
import React from 'react'

type OwnProps = {
  invitations?: { [key in string]: boolean }
  lockboxDevices: Array<any>
  userKYCState: KycStateType
}

type LinkDispatchPropsType = {
  actions: typeof actions.components.layoutWallet
  analyticsActions: typeof actions.analytics
  modalActions: typeof actions.modals
  preferencesActions: typeof actions.preferences
  simpleBuyActions: typeof actions.components.simpleBuy
}

type LinkStatePropsType = {
  domains: { [key in string]: string }
  supportedCoins: SupportedCoinsType
}

export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class NavigationContainer extends React.PureComponent<Props> {
  render () {
    const { domains } = this.props

    return (
      <Navigation
        {...this.props}
        exchangeUrl={concat(prop('exchange', domains), '/trade')}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions
    .getDomains(state)
    .getOrElse({ exchange: 'https://exchange.blockchain.com' }),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
