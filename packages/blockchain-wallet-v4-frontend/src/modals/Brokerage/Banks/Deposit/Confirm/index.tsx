import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getFormValues } from 'redux-form'
import React, { useEffect } from 'react'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

// import { getData } from './selectors'
// import Failure from './template.failure'
// import Loading from './template.loading'
import Success from './template.success'

const DepositMethods = props => {
  useEffect(() => {
    // if (props.fiatCurrency && !Remote.Success.is(props.data)) {
    //   props.simpleBuyActions.fetchSBFiatEligible(props.fiatCurrency)
    //   props.simpleBuyActions.fetchSBPaymentMethods(props.fiatCurrency)
    //   props.brokerageActions.fetchBankTransferAccounts()
    // }
  }, [])

  return <Success {...props} />
}

const mapStateToProps = (state: RootState) => ({
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: getFormValues('brokerageTx')(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DepositMethods)
