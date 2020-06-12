import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestLimitsType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { InterestMinMaxType, RatesType } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount () {
    this.handleInitializeDepositForm()
  }

  handleDisplayToggle = isCoin => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    })
    if (isCoin === displayCoin) return
    this.props.formActions.clearFields(
      'interestDepositForm',
      false,
      false,
      'depositAmount'
    )

    this.props.interestActions.setCoinDisplay(isCoin)
  }

  handleRefresh = () => {
    this.handleInitializeDepositForm()
  }

  handleInitializeDepositForm = () => {
    const { coin, walletCurrency } = this.props.data.getOrElse({
      coin: 'BTC' as CoinType,
      walletCurrency: 'GBP' as FiatType
    })
    this.props.interestActions.initializeDepositForm(coin, walletCurrency)
  }

  handleSubmit = () => {
    const { coin } = this.props.data.getOrElse({ coin: 'BTC' as CoinType })
    this.props.interestActions.submitDepositForm(coin)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
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

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
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
export type SuccessStateType = {
  coin: CoinType
  depositLimits: InterestMinMaxType
  displayCoin: boolean
  formErrors: { depositAmount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
  interestLimits: InterestLimitsType
  interestRate: InterestRateType
  rates: RatesType
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = ConnectedProps<typeof connector>

export default connector(DepositForm)
