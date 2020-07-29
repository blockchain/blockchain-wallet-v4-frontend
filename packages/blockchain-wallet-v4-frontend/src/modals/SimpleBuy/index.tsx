import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import {
  CoinType,
  FiatType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
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

import Loading from './template.loading'
import Pending from './template.pending'
import Rejected from './template.rejected'

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
    this.props.simpleBuyActions.fetchSBOrders(true)
    this.props.formActions.destroy('ccBillingAddress')
    this.props.formActions.destroy('addCCForm')
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  renderStep = (props: Props) => {
    switch (props.step) {
      case 'CURRENCY_SELECTION':
        return (
          <FlyoutChild>
            <CurrencySelection {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'ENTER_AMOUNT':
        return (
          <FlyoutChild>
            <EnterAmount {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'CRYPTO_SELECTION':
        return (
          <FlyoutChild>
            <CryptoSelection {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'PAYMENT_METHODS':
        return (
          <FlyoutChild>
            <PaymentMethods {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'ADD_CARD':
        return (
          <FlyoutChild>
            <AddCard {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'CC_BILLING_ADDRESS':
        return (
          <FlyoutChild>
            <BillingAddress {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case '3DS_HANDLER':
        return (
          <FlyoutChild>
            <ThreeDSHandler {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'CHECKOUT_CONFIRM':
        return (
          <FlyoutChild>
            <CheckoutConfirm {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'ORDER_SUMMARY':
        return (
          <FlyoutChild>
            <OrderSummary {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'TRANSFER_DETAILS':
        return (
          <FlyoutChild>
            <TransferDetails {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
      case 'CANCEL_ORDER':
        return (
          <FlyoutChild>
            <CancelOrder {...props} handleClose={this.handleClose} />
          </FlyoutChild>
        )
    }
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
        {this.props.data.cata({
          Success: val => {
            const { userData } = val
            const { kycState } = userData
            const isUserRejectedOrExpired =
              kycState === 'REJECTED' || kycState === 'EXPIRED'
            const isUserPending =
              kycState === 'UNDER_REVIEW' || kycState === 'PENDING'

            return isUserRejectedOrExpired ? (
              <Rejected handleClose={this.handleClose} />
            ) : isUserPending ? (
              <Pending
                handleClose={this.handleClose}
                handleRefresh={() => {
                  this.props.profileActions.fetchUserDataLoading()
                  this.props.profileActions.fetchUser()
                }}
              />
            ) : (
              this.renderStep(this.props)
            )
          },
          Failure: () => null,
          Loading: () => <Loading />,
          NotAsked: () => <Loading />
        })}
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
  displayBack: selectors.components.simpleBuy.getDisplayBack(state),

  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('SIMPLE_BUY_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  profileActions: typeof actions.modules.profile
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

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(SimpleBuy)
