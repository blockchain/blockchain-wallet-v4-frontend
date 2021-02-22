import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { useEffect } from 'react'

import { actions, selectors } from 'data'
import { BankDepositStepType } from 'data/types'
import { ExtractSuccess, FiatType, RemoteDataType } from 'core/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { SBPaymentMethodType } from 'core/network/api/settingsComponent/types'
import Failure from './template.failure'
import Loading from '../DepositMethods/template.loading'
import Success from './template.success'

const EnterAmount = props => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.simpleBuyActions.fetchSBPaymentMethods(props.fiatCurrency)
      props.simpleBuyActions.fetchSBFiatEligible(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
      props.simpleBuyActions.fetchSDDEligible()
    }
  })

  const onSubmit = () => {
    // props.brokerageActions.createFiatDeposit(vals.amount, props.fiatCurrency)
    props.brokerageActions.setStep({
      step: BankDepositStepType.CONFIRM
    })
  }

  return props.data.cata({
    Success: val => <Success {...val} {...props} onSubmit={onSubmit} />,
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'USD'
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method: SBPaymentMethodType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: FiatType
}
export type FailurePropsType = {
  fiatCurrency: FiatType
}

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
