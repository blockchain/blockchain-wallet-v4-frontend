import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { includes } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import Currencies from '@core/exchange/currencies'
import { getCurrency } from '@core/redux/settings/selectors'
import { CoinType, FiatType, RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { Analytics, EarnStepMetaData } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import AccountSummary from './template.success'
import Unsupported from './template.unsupported'

class AccountSummaryContainer extends PureComponent<Props> {
  componentDidMount() {
    this.handleFetchInterestLimits()
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
          <AccountSummary {...val} {...this.props} walletCurrency={walletCurrency} />
        )
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  interestUploadDocumentActions: bindActionCreators(
    actions.components.interestUploadDocument,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  handleBSClick: (string) => void
  handleClose: () => void
  showSupply: boolean
  stepMetadata: EarnStepMetaData
  walletCurrency: FiatType
}

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  buySellActions: typeof actions.components.buySell
  interestActions: typeof actions.components.interest
  interestUploadDocumentActions: typeof actions.components.interestUploadDocument
}

export type DataSuccessStateType = ReturnType<typeof getData>['data']

export type CurrencySuccessStateType = ReturnType<typeof getCurrency>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, DataSuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)
