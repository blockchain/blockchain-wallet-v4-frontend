import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { InterestRateType, RemoteDataType } from '@core/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'
import { useRemote, useWindowSize, WindowSize } from 'hooks'

import { StateType as ParentStateType, SuccessStateType as ParentSuccessStateType } from '..'
import MobileRow from './MobileRow'
import { getData } from './selectors'
import SortableTable from './SortableTable'

const LoadingBox = styled(SkeletonRectangle)`
  margin-bottom: 24px;
`
const LoadingCard = () => <LoadingBox width='330px' height='275px' />

const EarnTableContainer = (props: Props) => {
  const { isGoldTier, sortedInstruments } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const { width }: WindowSize = useWindowSize()

  if (error || !width || !isGoldTier) return null
  if (isLoading || isNotAsked || !data) return <LoadingCard />

  return width > 910 ? (
    <SortableTable {...data} {...props} />
  ) : (
    <>
      {sortedInstruments.map((instrument) => {
        return window.coins[instrument] ? (
          <MobileRow {...data} {...props} coin={instrument} key={instrument} />
        ) : null
      })}
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type OwnPropsType = {
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

export default connector(EarnTableContainer)
