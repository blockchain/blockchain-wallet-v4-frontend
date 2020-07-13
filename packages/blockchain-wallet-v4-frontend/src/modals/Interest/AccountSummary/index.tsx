import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { includes } from 'ramda'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestLimitsType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { InterestStepMetadata } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import AccountSummary from './template.success'
import Currencies from 'core/exchange/currencies'
import Loading from './template.loading'
import Unsupported from './template.unsupported'

class AccountSummaryContainer extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.handleFetchInterestLimits()
  }

  handleDepositClick = () => {
    const { coin } = this.props
    this.props.interestActions.showInterestModal('DEPOSIT', coin)
  }

  handleFetchInterestLimits = () => {
    const { coin } = this.props
    const { walletCurrency } = this.props.data.getOrElse({
      walletCurrency: 'GBP' as FiatType
    } as SuccessStateType)
    this.props.interestActions.fetchInterestLimits(coin, walletCurrency)
  }

  handleRefresh = () => {
    const { coin } = this.props
    this.props.interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
  }

  render () {
    const { data } = this.props
    const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
    return data.cata({
      Success: val =>
        includes(val.walletCurrency, unsupportedCurrencies) ? (
          <Unsupported {...val} {...this.props} />
        ) : (
          <AccountSummary
            {...val}
            {...this.props}
            handleDepositClick={this.handleDepositClick}
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
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
  handleSBClick: (string) => void
  stepMetadata: InterestStepMetadata
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type SuccessStateType = {
  accountBalances: InterestAccountBalanceType
  availToWithdraw: number
  interestLimits: InterestLimitsType
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)
