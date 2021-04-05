import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { SBPaymentMethodType } from 'blockchain-wallet-v4/src/network/api/settingsComponent/types'
import {
  ExtractSuccess,
  FiatType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankDWStepType } from 'data/types'

import Loading from '../DepositMethods/template.loading'
import { getData } from './selectors'
import Failure from './template.failure'
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
    props.brokerageActions.setDWStep({
      dwStep: BankDWStepType.CONFIRM
    })
  }

  return props.data.cata({
    Success: val => (
      <Success
        {...val}
        {...props}
        onSubmit={onSubmit}
        initialValues={{ currency: props.fiatCurrency }}
      />
    ),
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
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
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
