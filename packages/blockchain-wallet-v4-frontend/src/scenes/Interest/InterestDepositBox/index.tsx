import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
// import {
//   Button,
//   Icon,
//   Text,
//   TooltipHost,
//   TooltipIcon
// } from 'blockchain-info-components'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import {
  InterestAccountBalanceType,
  // InterestEligibleType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import React, { PureComponent } from 'react'
import Success from './template.success'

class InterestSummary extends PureComponent<Props> {
  componentDidMount () {
    this.props.interestActions.fetchInterestRate()
  }
  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: val => <Success {...this.props} {...val} />,
      Loading: () => <Success {...this.props} />,
      NotAsked: () => <Success {...this.props} />
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

export type OwnProps = {
  isDisabled: boolean
}

export type SuccessStateType = {
  interestAccount: InterestAccountBalanceType
  // interestEligible: InterestEligibleType
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
}

export type LinkStatePropsType = {
  data: RemoteDataType<string, Array<SuccessStateType>>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InterestSummary)
