import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { SkeletonRectangle, Text } from 'blockchain-info-components'

import { getData } from './selectors'
import {
  StateType as ParentStateType,
  SuccessStateType as ParentSuccessStateType
} from '..'

import SummaryCard from './template.success'

class SummaryCardContainer extends PureComponent<Props> {
  render () {
    return this.props.data.cata({
      Success: val => <SummaryCard {...this.props} {...val} />,
      Failure: () => (
        <Text size='16px' weight={500}>
          Oops. Something went wrong. Please refresh and try again.
        </Text>
      ),
      Loading: () => <SkeletonRectangle width='330px' height='250px' />,
      NotAsked: () => <SkeletonRectangle width='330px' height='250px' />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  coin: CoinType
  interestAccountBalance: InterestAccountBalanceType
  interestEligible: InterestEligibleType
  showInterestInfoBox: boolean
  supportedCoins: SupportedCoinsType
  walletCurrency: FiatType
}

export type OwnPropsType = {
  interestRate: InterestRateType
  isGoldTier: boolean
}

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType &
  ParentSuccessStateType &
  ParentStateType &
  ConnectedProps<typeof connector>

export default connector(SummaryCardContainer)
