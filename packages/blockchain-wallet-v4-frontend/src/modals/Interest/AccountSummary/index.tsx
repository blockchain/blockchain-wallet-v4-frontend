import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { includes } from 'ramda'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { CoinType, RemoteDataType } from 'core/types'
import { InterestStepMetadata } from 'data/types'
import DataError from 'components/DataError'

import { getCurrency } from 'core/redux/settings/selectors'
import { getData } from './selectors'
import AccountSummary from './template.success'
import Currencies from 'core/exchange/currencies'
import Loading from './template.loading'
import Unsupported from './template.unsupported'

class AccountSummaryContainer extends PureComponent<Props> {
  componentDidMount () {
    this.handleFetchInterestLimits()
  }

  handleDepositClick = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal('DEPOSIT', coin)
  }

  handleFetchInterestLimits = () => {
    const { coin, currency, interestActions } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    interestActions.fetchInterestLimits(coin, walletCurrency)
  }

  handleRefresh = () => {
    const { coin, interestActions } = this.props
    interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
  }

  render () {
    const { data, currency } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
    return data.cata({
      Success: val =>
        includes(walletCurrency, unsupportedCurrencies) ? (
          <Unsupported
            {...val}
            {...this.props}
            walletCurrency={walletCurrency}
          />
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
  data: getData(state),
  currency: getCurrency(state)
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

export type DataSuccessStateType = ReturnType<typeof getData>['data']

export type CurrencySuccessStateType = ReturnType<typeof getCurrency>['data']

type LinkStatePropsType = {
  currency: RemoteDataType<string | Error, CurrencySuccessStateType>,
  data: RemoteDataType<string | Error, DataSuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)
