import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { CoinType, InterestRateType, RemoteDataType } from '@core/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'

import { StateType as ParentStateType, SuccessStateType as ParentSuccessStateType } from '..'
import { getData } from './selectors'
import SummaryCard from './template.success'

const LoadingBox = styled(SkeletonRectangle)`
  margin-bottom: 24px;
`
const LoadingCard = () => <LoadingBox width='330px' height='275px' />

class SummaryCardContainer extends PureComponent<Props> {
  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <LoadingCard />,
      NotAsked: () => <LoadingCard />,
      Success: (val) => <SummaryCard {...this.props} {...val} />
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

export type OwnPropsType = {
  coin: CoinType
  interestRate: InterestRateType
  isGoldTier: boolean
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType &
  ParentSuccessStateType &
  ParentStateType &
  ConnectedProps<typeof connector>

export default connector(SummaryCardContainer)
