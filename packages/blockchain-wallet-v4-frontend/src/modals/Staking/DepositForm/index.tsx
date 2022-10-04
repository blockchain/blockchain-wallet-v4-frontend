import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import Loading from '../Staking.template.loading'
import { FORM_NAME } from './DepositForm.model'
import { getCurrency, getData, getUnderSanctionsMessage } from './DepositForm.selectors'
import Success from './DepositForm.template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount() {
    const { analyticsActions, coin, walletCurrency } = this.props
    this.handleInitializeDepositForm()
    analyticsActions.trackEvent({
      key: Analytics.WALLET_STAKING_DEPOSIT_VIEWED,
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

  handleDisplayToggle = (isCoin: boolean) => {
    const { data, earnActions, formActions } = this.props
    const { displayCoin } = data.getOrElse({
      displayCoin: false
    } as DataSuccessStateType)

    if (isCoin === displayCoin) return

    formActions.clearFields(FORM_NAME, false, false, 'depositAmount')

    earnActions.setCoinDisplay({ isAmountDisplayedInCrypto: isCoin })
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
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          handleDisplayToggle={this.handleDisplayToggle}
          walletCurrency={walletCurrency}
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
  setShowSupply: (boolean) => void
  walletCurrency: FiatType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
