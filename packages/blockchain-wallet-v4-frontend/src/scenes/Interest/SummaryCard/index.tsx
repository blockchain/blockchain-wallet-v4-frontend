import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import {
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestRateType,
  RemoteDataType
} from 'core/types'
import {
  StateType as ParentStateType,
  SuccessStateType as ParentSuccessStateType
} from '..'
import { SkeletonRectangle } from 'blockchain-info-components'
import React, { PureComponent } from 'react'
import SummaryCard from './template.success'

/*
  TODO List:
  1) error state
  2) show ineligible reason
  3) figure out where/how to createUser
*/
class SummaryCardContainer extends PureComponent<Props> {
  componentDidMount () {
    // this.props.profileActions.createUser()
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchInterestBalance()
  }
  render () {
    return this.props.data.cata({
      Success: val => <SummaryCard {...this.props} {...val} />,
      Failure: () => <p>ERROR: TODO</p>,
      Loading: () => <SkeletonRectangle width='330px' height='275px' />,
      NotAsked: () => <SkeletonRectangle width='330px' height='275px' />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type SuccessStateType = {
  interestAccountBalance: InterestAccountBalanceType
  interestEligible: InterestEligibleType
  showInterestInfoBox: boolean
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
