import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import {
  CoinType,
  FiatType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { includes } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import DataError from 'components/DataError'
import { actions } from 'data'
import { InterestStepMetadata } from 'data/types'
import { getData } from './selectors'
import Loading from './template.loading'
import AccountSummary from './template.success'
import Unsupported from './template.unsupported'

class AccountSummaryContainer extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.handleFetchInterestLimits()
  }

  handleDepositClick = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal('DEPOSIT', coin)
  }

  handleFetchInterestLimits = () => {
    const { coin, data, interestActions } = this.props
    const { walletCurrency } = data.getOrElse({
      walletCurrency: 'GBP' as FiatType
    } as SuccessStateType)
    interestActions.fetchInterestLimits(coin, walletCurrency)
  }

  handleRefresh = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
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

export type SuccessStateType = ReturnType<typeof getData>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)
