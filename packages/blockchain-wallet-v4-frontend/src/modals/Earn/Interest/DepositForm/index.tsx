import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import { getCurrency, getData, getUnderSanctionsMessage } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount() {
    const { analyticsActions, coin, walletCurrency } = this.props
    this.handleInitializeDepositForm()
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_DEPOSIT_VIEWED,
      properties: {
        currency: coin
      }
    })
    this.props.interestActions.fetchEDDDepositLimits({ currency: walletCurrency })
  }

  handleDisplayToggle = (isCoin: boolean) => {
    const { data, formActions, interestActions } = this.props
    const { displayCoin } = data.getOrElse({
      displayCoin: false
    } as DataSuccessStateType)

    if (isCoin === displayCoin) return

    formActions.clearFields('passiveRewardsDepositForm', false, false, 'depositAmount')

    interestActions.setCoinDisplay({ isAmountDisplayedInCrypto: isCoin })
  }

  handleRefresh = () => {
    this.handleInitializeDepositForm()
  }

  handleInitializeDepositForm = () => {
    const { coin, currency, interestActions } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    interestActions.initializeInterestDepositForm({ coin, currency: walletCurrency })
  }

  render() {
    const { currency, data, underSanctionsMessage } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    return data.cata({
      Failure: () =>
        underSanctionsMessage ? (
          <DataError onClick={this.handleRefresh} message={{ message: underSanctionsMessage }} />
        ) : (
          <DataError onClick={this.handleRefresh} />
        ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          walletCurrency={walletCurrency}
          handleDisplayToggle={this.handleDisplayToggle}
        />
      )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  currency: getCurrency(state),
  data: getData(state),
  underSanctionsMessage: getUnderSanctionsMessage(state)
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
  setShowSupply: (boolean) => void
  walletCurrency: FiatType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
