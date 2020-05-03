import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  InterestAccountBalanceType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'

import { getData } from './selectors'
import Loading from './template.loading'
import WithdrawalForm from './template.success'

class WithdrawalFormContainer extends PureComponent<Props> {
  render () {
    const { data } = this.props
    return data.cata({
      Success: val => <WithdrawalForm {...val} {...this.props} />,
      Failure: () => null,
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

export type SuccessStateType = {
  accountBalances: InterestAccountBalanceType
  coin: CoinType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WithdrawalFormContainer)
