import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import Loading from '../Staking.template.loading'
import { getCurrency, getData, getUnderSanctionsMessage } from './DepositForm.selectors'
import Success from './DepositForm.template.success'

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
    this.props.earnActions.setCoinDisplay({ isAmountDisplayedInCrypto: true })
    this.props.earnActions.fetchEDDDepositLimits({ currency: walletCurrency })
  }

  handleRefresh = () => {
    this.handleInitializeDepositForm()
  }

  handleInitializeDepositForm = () => {
    const { coin, currency, earnActions } = this.props
    const walletCurrency = currency.getOrElse('GBP' as CurrencySuccessStateType)

    earnActions.initializeStakingDepositForm({ coin, currency: walletCurrency })
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
      Success: (val) => <Success {...this.props} {...val} walletCurrency={walletCurrency} />
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
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  earnActions: typeof actions.components.interest
  formActions: typeof actions.form
}

export type DataSuccessStateType = ReturnType<typeof getData>['data']

export type CurrencySuccessStateType = ReturnType<typeof getCurrency>['data']

export type OwnProps = {
  coin: CoinType
  walletCurrency: FiatType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
