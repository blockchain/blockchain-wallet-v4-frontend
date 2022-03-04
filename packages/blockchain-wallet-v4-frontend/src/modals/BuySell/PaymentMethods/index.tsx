import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSOrderActionType, BSOrderType, BSPairType, FiatType, RemoteDataType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import getData from './selectors'
import Success from './template.success'

class PaymentMethods extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchFiatEligible(this.props.fiatCurrency)
      this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
      this.props.buySellActions.fetchCards(false)
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  errorCallback() {
    this.props.buySellActions.setStep({
      cryptoCurrency: 'BTC',
      fiatCurrency: this.props.fiatCurrency || 'USD',
      pair: this.props.pair,
      step: 'ENTER_AMOUNT'
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => (
        <FlyoutOopsError
          action='retry'
          handler={this.errorCallback}
          data-e2e='sbTryCurrencySelectionAgain'
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: BSOrderType
  orderType: BSOrderActionType
  pair: BSPairType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(PaymentMethods)
