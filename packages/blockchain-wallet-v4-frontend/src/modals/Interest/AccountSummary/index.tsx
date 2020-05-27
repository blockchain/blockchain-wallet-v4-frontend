import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
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
import Loading from './template.loading'

class AccountSummaryContainer extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.handleFetchInterestLimits()
  }

  handleDepositClick = () => {
    this.props.interestActions.showInterestModal('DEPOSIT')
  }

  handleFetchInterestLimits = () => {
    const { coin, walletCurrency } = this.props.data.getOrElse({
      coin: 'BTC' as CoinType,
      walletCurrency: 'GBP' as FiatType
    })
    this.props.interestActions.fetchInterestLimits(coin, walletCurrency)
  }

  handleRefresh = () => {
    this.props.interestActions.showInterestModal('ACCOUNT_SUMMARY')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
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
  handleClose: () => void
  handleSBClick: () => void
  stepMetadata: InterestStepMetadata
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type SuccessStateType = {
  accountBalances: InterestAccountBalanceType
  coin: CoinType
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
