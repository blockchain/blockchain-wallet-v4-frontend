import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, RecurringBuyStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import CheckoutConfirm from './CheckoutConfirm'
import Details from './Details'
import Frequency from './Frequency'
import GetStarted from './GetStarted'
import Notifications from './Notifications'
import RemoveConfirm from './RemoveConfirm'
import Summary from './Summary'

class RecurringBuys extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return (
      <Flyout {...this.props} isOpen={this.state.show} onClose={this.handleClose}>
        {this.props.step === RecurringBuyStepType.INIT_PAGE && (
          <FlyoutChild>
            <Notifications handleClose={this.handleClose} {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.GET_STARTED && (
          <FlyoutChild>
            <GetStarted {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.CHECKOUT_CONFIRM && (
          <FlyoutChild>
            <CheckoutConfirm {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.FREQUENCY && (
          <FlyoutChild>
            <Frequency {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.SUMMARY && (
          <FlyoutChild>
            <Summary {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.DETAILS && (
          <FlyoutChild>
            <Details {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === RecurringBuyStepType.REMOVE_CONFIRM && (
          <FlyoutChild>
            <RemoveConfirm {...this.props} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.recurringBuy.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.RECURRING_BUYS_MODAL, { transition: duration }),
  connector
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(RecurringBuys)
