import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { concat, prop } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { getCoinsSortedByBalance } from 'components/Balances/selectors'
import { actions, selectors } from 'data'

import { Props as OwnProps } from '../template.success'
import Navigation from './template'

const NavigationContainer = (props: Props) => {
  useEffect(() => {
    props.getCardProductsAction()
  }, [])

  const { domains } = props

  return <Navigation {...props} exchangeUrl={concat(prop('exchange', domains), '/trade')} />
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  getCardProductsAction: bindActionCreators(actions.components.debitCard.getProducts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const mapStateToProps = (state) => ({
  coinList: getCoinsSortedByBalance(state),
  isRedesignEnabled: selectors.core.walletOptions
    .getRedesignEnabled(state)
    .getOrElse(false) as boolean,
  walletDebitCardEnabled: selectors.components.debitCard.isDebitCardModuleEnabledForAccount(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(connector)

export type Props = OwnProps & ConnectedProps<typeof connector> & { lockboxDevices?: Array<any> }

export default enhance(NavigationContainer)
