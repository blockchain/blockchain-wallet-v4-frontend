import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ModalPropsType } from '../types'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'
import { SimpleBuyStepType } from 'data/types'
import CancelOrder from './CancelOrder'
import CheckoutConfirm from './CheckoutConfirm'
import CurrencySelection from './CurrencySelection'
import EnterAmount from './EnterAmount'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'
import OrderSummary from './OrderSummary'
import React, { PureComponent } from 'react'
import TransferDetails from './TransferDetails'

type OwnProps = ModalPropsType
export type LinkDispatchPropsType = {
  settingsActions: typeof actions.modules.settings
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType =
  | {
      step: 'CURRENCY_SELECTION'
    }
  | {
      step: 'ENTER_AMOUNT'
    }
  | {
      order: SBOrderType
      step:
        | 'CHECKOUT_CONFIRM'
        | 'TRANSFER_DETAILS'
        | 'ORDER_SUMMARY'
        | 'CANCEL_ORDER'
    }

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = { direction: 'left' | 'right'; show: boolean }

class SimpleBuy extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (
      SimpleBuyStepType[this.props.step] > SimpleBuyStepType[prevProps.step]
    ) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  componentWillUnmount () {
    this.props.simpleBuyActions.destroyCheckout()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='simpleBuyModal'
      >
        {this.props.step === 'CURRENCY_SELECTION' && (
          <FlyoutChild>
            <CurrencySelection {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'ENTER_AMOUNT' && (
          <FlyoutChild>
            <EnterAmount {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'CHECKOUT_CONFIRM' && (
          <FlyoutChild>
            <CheckoutConfirm {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'ORDER_SUMMARY' && (
          <FlyoutChild>
            <OrderSummary {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'TRANSFER_DETAILS' && (
          <FlyoutChild>
            <TransferDetails {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'CANCEL_ORDER' && (
          <FlyoutChild>
            <CancelOrder {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.simpleBuy.getStep(state),
  order: selectors.components.simpleBuy.getSBOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(
  ModalEnhancer('SIMPLE_BUY_MODAL', { transition: duration }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SimpleBuy)
