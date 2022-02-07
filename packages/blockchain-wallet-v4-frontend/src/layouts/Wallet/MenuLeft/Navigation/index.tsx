import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { concat, prop } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { getCoinsSortedByBalance } from 'components/Balances/selectors'
import { actions, selectors } from 'data'

import { Props as OwnProps } from '../template.success'
import Navigation from './template'

class NavigationContainer extends React.PureComponent<Props> {
  render() {
    const { domains } = this.props

    return <Navigation {...this.props} exchangeUrl={concat(prop('exchange', domains), '/trade')} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const mapStateToProps = (state) => ({
  coinList: getCoinsSortedByBalance(state),
  isRedesignEnabled: selectors.core.walletOptions
    .getRedesignEnabled(state)
    .getOrElse(false) as boolean
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(connector)

export type Props = OwnProps & ConnectedProps<typeof connector> & { lockboxDevices?: Array<any> }

export default enhance(NavigationContainer)
