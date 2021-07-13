import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { DEFAULT_SB_METHODS } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import getData from './selectors'
import Failure from './template.failure'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBPairs(this.props.fiatCurrency, this.props.cryptoCurrency)
      this.props.brokerageActions.fetchBankTransferAccounts()
      this.props.simpleBuyActions.fetchSBCards()
      this.props.simpleBuyActions.fetchSDDEligible()
    }

    // data was successful but paymentMethods was DEFAULT_SB_METHODS
    if (this.props.fiatCurrency && Remote.Success.is(this.props.data)) {
      if (equals(this.props.data.data.paymentMethods, DEFAULT_SB_METHODS)) {
        this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      }
    }
  }

  render() {
    return this.props.data.cata({
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  cryptoCurrency: selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: SBPaymentMethodType
  order?: SBOrderType
  orderType: SBOrderActionType
  pair: SBPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkStatePropsType = {
  cryptoCurrency: CoinType
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
}
export type FailurePropsType = {
  fiatCurrency: undefined | FiatType
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
