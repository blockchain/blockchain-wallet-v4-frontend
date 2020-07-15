import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestLimitsType,
  RatesType,
  RemoteDataType,
  SupportedCoinsType,
  WithdrawalMinimumType
} from 'core/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import BigNumber from 'bignumber.js'
import Loading from './template.loading'
import WithdrawalForm from './template.success'

class WithdrawalFormContainer extends PureComponent<Props> {
  componentDidMount () {
    const { coin } = this.props
    this.props.interestActions.initializeWithdrawalForm(coin)
  }

  handleDisplayToggle = isCoin => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    } as SuccessStateType)
    if (isCoin === displayCoin) return
    this.props.formActions.clearFields(
      'interestWithdrawalForm',
      false,
      false,
      'withdrawalAmount'
    )
    this.props.interestActions.setCoinDisplay(isCoin)
  }

  handleRefresh = () => {
    const { coin } = this.props
    this.props.interestActions.initializeWithdrawalForm(coin)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <WithdrawalForm
          {...val}
          {...this.props}
          handleDisplayToggle={this.handleDisplayToggle}
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
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  accountBalances: InterestAccountBalanceType
  availToWithdraw: BigNumber
  coin: CoinType
  displayCoin: boolean
  interestLimits: InterestLimitsType
  rates: RatesType
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
  withdrawalMinimums: WithdrawalMinimumType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

export type OwnProps = {
  coin: CoinType
}

export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WithdrawalFormContainer)
