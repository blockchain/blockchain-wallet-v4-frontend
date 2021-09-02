import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { includes } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { getCurrency } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { CoinType, FiatType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { InterestStepMetadata } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import AccountSummary from './template.success'
import Unsupported from './template.unsupported'

class AccountSummaryContainer extends PureComponent<Props> {
  componentDidMount() {
    this.handleFetchInterestLimits()
  }

  handleDepositClick = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal({ coin, step: 'DEPOSIT' })
  }

  handleFetchInterestLimits = () => {
    const { coin, interestActions, walletCurrency } = this.props
    interestActions.fetchInterestLimits({ coin, currency: walletCurrency })
  }

  handleRefresh = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })
  }

  render() {
    const { data, walletCurrency } = this.props

    const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
    return data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) =>
        includes(walletCurrency, unsupportedCurrencies) ? (
          <Unsupported {...val} {...this.props} walletCurrency={walletCurrency} />
        ) : (
          <AccountSummary
            {...val}
            {...this.props}
            handleDepositClick={this.handleDepositClick}
            walletCurrency={walletCurrency}
          />
        )
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
  handleSBClick: (string) => void
  showSupply: boolean
  stepMetadata: InterestStepMetadata
  walletCurrency: FiatType
}

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  interestActions: typeof actions.components.interest
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type DataSuccessStateType = ReturnType<typeof getData>['data']

export type CurrencySuccessStateType = ReturnType<typeof getCurrency>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, DataSuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)
