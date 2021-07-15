import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { ExtractSuccess, RemoteDataType, SBOrderType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods, RecurringBuysStepType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import SuccessSdd from './template.sdd.success'
import Success from './template.success'

class OrderSummary extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
      this.props.sendActions.getLockRule()
    }
    this.props.simpleBuyActions.fetchSBOrders()

    if (
      this.props.order.state === 'PENDING_DEPOSIT' &&
      this.props.order.attributes?.everypay?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
    ) {
      this.props.simpleBuyActions.setStep({
        order: this.props.order,
        step: '3DS_HANDLER'
      })
    }
    this.props.interestActions.fetchShowInterestCardAfterTransaction()
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  okButtonHandler = () => {
    // first time buyers have 1 tx at this point so and RB is set to one time buy so send them to RB walkthrough flow
    // FIXME: The logic on the line below is hacked to be wrong so I can test.
    if (
      this.props.orders.length > 1 &&
      this.props.order.frequency !== RecurringBuyPeriods.ONE_TIME
    ) {
      this.props.recurringBuyActions.showModal('SimpleBuyStatus')
      this.props.recurringBuyActions.setStep({ step: RecurringBuysStepType.GET_STARTED })
    } else {
      this.props.handleClose()
    }
  }

  render() {
    const { state } = this.props.order
    return this.props.data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => {
        return state === 'FAILED' || state === 'CANCELED' ? (
          <DataError onClick={this.handleRefresh} />
        ) : val.userData?.tiers?.current !== 2 ? (
          <SuccessSdd {...val} {...this.props} />
        ) : (
          <Success okButtonHandler={this.okButtonHandler} {...val} {...this.props} />
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  isGoldVerified: equals(selectors.modules.profile.getCurrentTier(state), 2),
  orders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([])
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  isGoldVerified: boolean
  orders: SBOrderType[]
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
