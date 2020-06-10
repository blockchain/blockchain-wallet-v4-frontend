import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestLimitsType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RatesType } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import WithdrawalForm from './template.success'

class WithdrawalFormContainer extends PureComponent<Props> {
  componentDidMount () {
    this.props.interestActions.initializeWithdrawalForm('BTC')
  }

  handleCoinClick = () => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    })
    !displayCoin &&
      this.props.formActions.clearFields(
        'interestWithdrawalForm',
        false,
        false,
        'withdrawalAmount'
      )

    this.props.interestActions.setCoinDisplay(true)
  }

  handleFiatClick = () => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    })
    displayCoin &&
      this.props.formActions.clearFields(
        'interestWithdrawalForm',
        false,
        false,
        'withdrawalAmount'
      )
    this.props.interestActions.setCoinDisplay(false)
  }

  handleRefresh = () => {
    this.props.interestActions.initializeWithdrawalForm('BTC')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <WithdrawalForm
          {...val}
          {...this.props}
          handleCoinClick={this.handleCoinClick}
          handleFiatClick={this.handleFiatClick}
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
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  accountBalanceStandard: number
  accountBalances: InterestAccountBalanceType
  availToWithdrawCrypto: number
  availToWithdrawFiat: number
  coin: CoinType
  displayCoin: boolean
  interestLimits: InterestLimitsType
  rates: RatesType
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}

type Props = ConnectedProps<typeof connector>

export default connector(WithdrawalFormContainer)
