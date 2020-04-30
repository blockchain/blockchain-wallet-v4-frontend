import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  InterestAccountBalanceType,
  InterestEligibleType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { SkeletonRectangle } from 'blockchain-info-components'
import React, { PureComponent } from 'react'
import SummaryCard from './template.success'

/*
  TODO List:
  1) fix TS errors
  2) error state
  3) show ineligible reason
*/
class SummaryCardContainer extends PureComponent<Props> {
  // componentDidMount() {
  //   this.props.interestActions.initializeSummaryCard()
  // }
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

export type OwnPropsType = {
  coin: CoinType
  interestAccountBalance: InterestAccountBalanceType
  interestEligible: InterestEligibleType
  showInterestInfoBox: boolean
  supportedCoins: SupportedCoinsType
}

export type LinkStatePropsType = {
  data: RemoteDataType<string, Array<OwnPropsType>>
}

export type Props = OwnPropsType & ConnectedProps<typeof connector>

export default connector(SummaryCardContainer)
