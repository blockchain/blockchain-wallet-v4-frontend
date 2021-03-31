import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getCurrency, getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount() {
    this.handleInitializeDepositForm()
  }

  handleDisplayToggle = (isCoin: boolean) => {
    const { data, formActions, interestActions } = this.props
    const { displayCoin } = data.getOrElse({
      displayCoin: false
    } as DataSuccessStateType)

    if (isCoin === displayCoin) return

    formActions.clearFields(
      'interestDepositForm',
      false,
      false,
      'depositAmount'
    )

    interestActions.setCoinDisplay(isCoin)
  }

  handleRefresh = () => {
    this.handleInitializeDepositForm()
  }

  handleInitializeDepositForm = () => {
    const { coin, currency, interestActions } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    interestActions.initializeDepositForm(coin, walletCurrency)
  }

  handleSubmit = () => {
    const { coin, interestActions } = this.props
    interestActions.submitDepositForm(coin)
  }

  render() {
    const { currency, data } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    return data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          walletCurrency={walletCurrency}
          onSubmit={this.handleSubmit}
          handleDisplayToggle={this.handleDisplayToggle}
        />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  currency: getCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}

export type DataSuccessStateType = ReturnType<typeof getData>['data']

export type CurrencySuccessStateType = ReturnType<typeof getCurrency>['data']

export type OwnProps = {
  coin: CoinType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
