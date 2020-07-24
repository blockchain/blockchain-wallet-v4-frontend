import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import {
  CoinType,
  FiatType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { connect } from 'react-redux'
import { ModalPropsType } from '../types'
import { RootState } from 'data/rootReducer'
import { SimpleBuyStepType } from 'data/types'
import AddCard from './AddCard'
import BillingAddress from './BillingAddress'
import CancelOrder from './CancelOrder'
import CheckoutConfirm from './CheckoutConfirm'
import CryptoSelection from './CryptoSelection'
import CurrencySelection from './CurrencySelection'
import EnterAmount from './EnterAmount'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'
import OrderSummary from './OrderSummary'
import PaymentMethods from './PaymentMethods'
import React, { PureComponent } from 'react'
import ThreeDSHandler from './ThreeDSHandler'
import TransferDetails from './TransferDetails'

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
    this.props.simpleBuyActions.pollSBBalances()
    this.props.simpleBuyActions.destroyCheckout()
    this.props.formActions.destroy('ccBillingAddress')
    this.props.formActions.destroy('addCCForm')
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
        {this.props.step === 'CRYPTO_SELECTION' && (
          <FlyoutChild>
            <CryptoSelection {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'PAYMENT_METHODS' && (
          <FlyoutChild>
            <PaymentMethods {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'ADD_CARD' && (
          <FlyoutChild>
            <AddCard {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'CC_BILLING_ADDRESS' && (
          <FlyoutChild>
            <BillingAddress {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === '3DS_HANDLER' && (
          <FlyoutChild>
            <ThreeDSHandler {...this.props} handleClose={this.handleClose} />
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
  cardId: selectors.components.simpleBuy.getSBCardId(state),
  pair: selectors.components.simpleBuy.getSBPair(state),
  method: selectors.components.simpleBuy.getSBPaymentMethod(state),
  order: selectors.components.simpleBuy.getSBOrder(state),
  cryptoCurrency: selectors.components.simpleBuy.getCryptoCurrency(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  displayBack: selectors.components.simpleBuy.getDisplayBack(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(
  ModalEnhancer('SIMPLE_BUY_MODAL', { transition: duration }),
  connect(mapStateToProps, mapDispatchToProps)
)

type OwnProps = ModalPropsType
export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  settingsActions: typeof actions.modules.settings
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType =
  | {
      step:
        | 'CURRENCY_SELECTION'
        | 'CRYPTO_SELECTION'
        | '3DS_HANDLER'
        | 'CC_BILLING_ADDRESS'
    }
  | {
      displayBack?: boolean
      fiatCurrency: FiatType
      pair: SBPairType
      step: 'TRANSFER_DETAILS'
    }
  | {
      order: SBOrderType
      step: 'CHECKOUT_CONFIRM' | 'ORDER_SUMMARY' | 'CANCEL_ORDER'
    }
  | {
      cardId?: string
      cryptoCurrency?: CoinType
      pair: SBPairType
      step: 'ADD_CARD'
    }
  | {
      method?: SBPaymentMethodType
      order?: SBOrderType
      pair: SBPairType
      step: 'ENTER_AMOUNT'
    }
  | {
      order: SBOrderType
      pair: SBPairType
      step: 'PAYMENT_METHODS'
    }

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(SimpleBuy)
