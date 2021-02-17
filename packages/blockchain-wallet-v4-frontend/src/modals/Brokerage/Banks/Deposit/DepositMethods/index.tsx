import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import React, { useEffect } from 'react'

import { actions, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

const DepositMethods = props => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.simpleBuyActions.fetchSBFiatEligible(props.fiatCurrency)
      props.simpleBuyActions.fetchSBPaymentMethods(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
    }
  })
  return props.data.cata({
    Success: val => <Success {...val} {...props} />,
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DepositMethods)
