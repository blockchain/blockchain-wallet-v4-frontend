import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import {
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { OwnProps } from '..'
import { SkeletonRectangle } from 'blockchain-info-components'
import React, { PureComponent } from 'react'
import Success from './template.success'

class InterestSummary extends PureComponent<Props> {
  componentDidMount () {
    this.props.profileActions.createUser()
    this.props.interestActions.fetchInterestRate()
    this.props.interestActions.fetchInterestBalance()
    this.props.interestActions.fetchInterestEligible()
  }

  fetchInterestInfo = () => {}
  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: () => null,
      Loading: () => <SkeletonRectangle width='330px' height='275px' />,
      NotAsked: () => null
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
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
}

export type LinkStatePropsType = {
  data: RemoteDataType<string, Array<SuccessStateType>>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InterestSummary)
