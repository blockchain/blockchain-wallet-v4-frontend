import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { concat, prop } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'

import { Props as OwnProps } from '../template.success'
import Navigation from './template'

const NavigationContainer = (props: Props) => {
  const { domains } = props

  return <Navigation {...props} exchangeUrl={concat(prop('exchange', domains), '/trade')} />
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const mapStateToProps = (state) => ({
  coinList: selectors.balances.getTotalWalletBalancesSorted(state),
  isKycVerificationEnabled: selectors.custodial.isKycVerificationEnabled(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(connector)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(NavigationContainer)
