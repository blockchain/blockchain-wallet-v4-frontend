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
import React, { PureComponent } from 'react'
import Success from './template.success'

class InterestSummary extends PureComponent<Props> {
  componentDidMount () {
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchInterestBalance()
    this.props.interestActions.fetchInterestRate()
  }
  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type SuccessStateType = {
  interestAccount: InterestAccountBalanceType
  interestEligible: InterestEligibleType
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
}

export type LinkStatePropsType = {
  data: RemoteDataType<string, Array<SuccessStateType>>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InterestSummary)
