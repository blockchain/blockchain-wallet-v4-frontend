import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { bindActionCreators, Dispatch } from 'redux'

import {
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestEDDStatus,
  InterestLimitsType,
  RatesType,
  RemoteDataType,
  WithdrawalMinimumType,
  WithdrawLimits
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'

import getData from './selectors'
import Loading from './template.loading'
import WithdrawalForm from './template.success'

class WithdrawalFormContainer extends PureComponent<Props> {
  componentDidMount() {
    const { walletCurrency } = this.props
    this.handleRefresh()
    this.props.interestActions.fetchEddWithdrawLimits(walletCurrency)
  }

  handleDisplayToggle = (isCoin: boolean) => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    } as SuccessStateType)
    if (isCoin === displayCoin) return
    this.props.formActions.clearFields('interestWithdrawalForm', false, false, 'withdrawalAmount')
    this.props.interestActions.setCoinDisplay(isCoin)
  }

  handleRefresh = () => {
    const { coin, interestActions, walletCurrency } = this.props
    interestActions.initializeWithdrawalForm(coin, walletCurrency)
  }

  render() {
    const { data } = this.props
    return data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <WithdrawalForm {...val} {...this.props} handleDisplayToggle={this.handleDisplayToggle} />
      )
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
  accountBalances: InterestAccountBalanceType
  availToWithdraw: BigNumber
  coin: CoinType
  displayCoin: boolean
  interestEDDStatus: InterestEDDStatus
  interestEDDWithdrawLimits: WithdrawLimits
  interestLimits: InterestLimitsType
  rates: RatesType
  withdrawalMinimums: WithdrawalMinimumType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

export type OwnProps = {
  coin: CoinType
  setShowSupply: (boolean) => void
  walletCurrency: FiatType
}

export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WithdrawalFormContainer)
