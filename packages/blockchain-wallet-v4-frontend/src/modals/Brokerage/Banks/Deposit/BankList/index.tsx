import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { useEffect } from 'react'

import { actions, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { WalletFiatType } from 'core/types'

import { getData } from './selectors'
// import Failure from './template.success'
// import Loading from './template.success'
import Success from './template.success'

const DepositMethods = props => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankTransferAccounts()
    }
  }, [])

  return props.data.cata({
    Success: val => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = { fiatCurrency?: WalletFiatType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositMethods)
