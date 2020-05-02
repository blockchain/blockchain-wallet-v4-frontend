import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  InterestLimitsType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RatesType, UserDataType } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

// change in future when more coins are supported
const DEPOSIT_COIN = 'BTC'

class DepositForm extends PureComponent<Props> {
  componentDidMount () {
    this.props.interestActions.initializeDepositForm(DEPOSIT_COIN)
  }

  handleRefresh = () => {
    this.props.interestActions.initializeDepositForm(DEPOSIT_COIN)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => <Success {...val} {...this.props} coin={DEPOSIT_COIN} />,
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
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  handleClose: () => void
}
export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}
export type SuccessStateType = {
  coin: CoinType
  interestRate: InterestRateType
  limits: InterestLimitsType
  rates: RatesType
  supportedCoins: SupportedCoinsType
  userData: UserDataType
  walletCurrency: string
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
