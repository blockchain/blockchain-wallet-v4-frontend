import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { InterestRateType, RemoteDataType } from '@core/types'
import { actions } from 'data'
import { useRemote } from 'hooks'
import { useMedia } from 'services/styles'

import { SuccessStateType as ParentSuccessStateType } from '..'
import Loading from '../Interest.loading.template'
import MobileRow from './MobileRow'
import { getData } from './selectors'
import SortableTable from './SortableTable'

const EarnTableContainer = (props: Props) => {
  const { sortedInstruments } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const isTabletL = useMedia('tabletL')

  if (error) return null
  if (isLoading || isNotAsked || !data) return <Loading />

  return isTabletL ? (
    <>
      {sortedInstruments.map((instrument) => {
        return window.coins[instrument] ? (
          <MobileRow {...data} {...props} coin={instrument} key={instrument} />
        ) : null
      })}
    </>
  ) : (
    <SortableTable {...data} {...props} />
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
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType & ParentSuccessStateType & ConnectedProps<typeof connector>

export default connector(EarnTableContainer)
