import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBPaymentMethodType
} from 'core/types'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

class PaymentMethods extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBCards()
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  fiatCurrency: FiatType
  handleBack: () => void
  handleClose: () => void
  handleFailure: () => void
  handleSubmit: (method: SBPaymentMethodType) => void
  orderType?: SBOrderActionType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(PaymentMethods)
