import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { DEFAULT_SB_METHODS } from 'data/components/simpleBuy/model'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBPairs(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBCards()
    }

    // data was successful but paymentMethods was DEFAULT_SB_METHODS
    if (this.props.fiatCurrency && Remote.Success.is(this.props.data)) {
      if (equals(this.props.data.data.paymentMethods, DEFAULT_SB_METHODS)) {
        this.props.simpleBuyActions.fetchSBPaymentMethods(
          this.props.fiatCurrency
        )
      }
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
  data: getData(state),
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
