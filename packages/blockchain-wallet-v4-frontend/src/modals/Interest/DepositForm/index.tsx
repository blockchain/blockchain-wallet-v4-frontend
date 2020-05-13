import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestLimitsType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { InterestMinMaxType, RatesType } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount () {
    this.props.interestActions.initializeDepositForm('BTC')
  }

  handleRefresh = () => {
    this.props.interestActions.initializeDepositForm('BTC')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => <Success {...val} {...this.props} />,
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
export type SuccessStateType = {
  coin: CoinType
  depositLimits: InterestMinMaxType
  interestLimits: InterestLimitsType
  interestRate: InterestRateType
  rates: RatesType
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = ConnectedProps<typeof connector>

export default connector(DepositForm)
