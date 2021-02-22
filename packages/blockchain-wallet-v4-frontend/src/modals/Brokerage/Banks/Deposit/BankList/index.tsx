import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { useEffect } from 'react'

import { actions, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'

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

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(DepositMethods)
