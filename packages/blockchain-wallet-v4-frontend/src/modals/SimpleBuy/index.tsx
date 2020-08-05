import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import {
  CoinType,
  FiatType,
  SBOrderActionType,
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
import KycRequired from './KycRequired'
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

  render () {
    return this.props.data.cata({
      Success: val => {
        const { userData } = val
        const { kycState } = userData
        const isUserRejectedOrExpired =
          kycState === 'REJECTED' || kycState === 'EXPIRED'
        const isUserPending =
          kycState === 'UNDER_REVIEW' || kycState === 'PENDING'

        return isUserRejectedOrExpired ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            in={this.state.show}
            direction={this.state.direction}
            data-e2e='simpleBuyModal'
          >
            <Rejected handleClose={this.handleClose} />
          </Flyout>
        ) : isUserPending ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            in={this.state.show}
            direction={this.state.direction}
            data-e2e='simpleBuyModal'
          >
            <Pending
              handleClose={this.handleClose}
              handleRefresh={() => {
                this.props.profileActions.fetchUserDataLoading()
                this.props.profileActions.fetchUser()
              }}
            />
          </Flyout>
        ) : (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            in={this.state.show}
            direction={this.state.direction}
            data-e2e='simpleBuyModal'
          >
            {this.props.step === 'CURRENCY_SELECTION' && (
              <FlyoutChild>
                <CurrencySelection
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'ENTER_AMOUNT' && (
              <FlyoutChild>
                <EnterAmount {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'CRYPTO_SELECTION' && (
              <FlyoutChild>
                <CryptoSelection
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'PAYMENT_METHODS' && (
              <FlyoutChild>
                <PaymentMethods
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'ADD_CARD' && (
              <FlyoutChild>
                <AddCard {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'CC_BILLING_ADDRESS' && (
              <FlyoutChild>
                <BillingAddress
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === '3DS_HANDLER' && (
              <FlyoutChild>
                <ThreeDSHandler
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'CHECKOUT_CONFIRM' && (
              <FlyoutChild>
                <CheckoutConfirm
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'ORDER_SUMMARY' && (
              <FlyoutChild>
                <OrderSummary {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'TRANSFER_DETAILS' && (
              <FlyoutChild>
                <TransferDetails
                  {...this.props}
                  handleClose={this.handleClose}
                />
              </FlyoutChild>
            )}
            {this.props.step === 'CANCEL_ORDER' && (
              <FlyoutChild>
                <CancelOrder {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'KYC_REQUIRED' && (
              <FlyoutChild>
                <KycRequired {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
          </Flyout>
        )
      },
      Failure: () => null,
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='simpleBuyModal'
        >
          <Loading />
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='simpleBuyModal'
        >
          <Loading />
        </Flyout>
      )
    })
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
  actionType: selectors.components.simpleBuy.getActionType(state),
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
        | 'KYC_REQUIRED'
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
      actionType: SBOrderActionType
      method?: SBPaymentMethodType
      order?: SBOrderType
      pair: SBPairType
      step: 'ENTER_AMOUNT'
    }
  | {
      actionType: SBOrderActionType
      order: SBOrderType
      pair: SBPairType
      step: 'PAYMENT_METHODS'
    }

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(SimpleBuy)
