import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, isEmpty, propEq, propOr } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  BSOrderActionType,
  BSOrderType,
  BSPairType,
  BSPaymentMethodType,
  BSPaymentTypes,
  CoinType,
  FiatType,
  MobilePaymentType
} from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import PaymentAccountError from 'components/Flyout/PaymentAccountError'
import { actions, model, selectors } from 'data'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { GoalsType } from 'data/goals/types'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BankStatusType,
  BrokerageModalOriginType,
  FastLinkType,
  ModalName,
  PlaidSettlementErrorReasons
} from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading as StdLoading, LoadingTextEnum } from '../components'
import { ModalPropsType } from '../types'
import AddCardCheckoutDotCom from './AddCardCheckoutDotCom'
import AddCardVgs from './AddCardVgs'
import Authorize from './Authorize'
import BankWireDetails from './BankWireDetails'
import BillingAddress from './BillingAddress'
import CheckoutConfirm from './CheckoutConfirm'
import { ConfirmingBuyOrder } from './ConfirmingBuyOrder'
import CryptoSelection from './CryptoSelection'
import EnterAmount from './EnterAmount'
import Frequency from './Frequency'
import KycRequired from './KycRequired'
import LinkedPaymentAccounts from './LinkedPaymentAccounts'
import OpenBankingConnect from './OpenBankingConnect'
import OrderSummary from './OrderSummary'
import PaymentMethods from './PaymentMethods'
import PreviewSell from './PreviewSell'
import getData from './selectors'
import SellEnterAmount from './SellEnterAmount'
import SellOrderSummary from './SellOrderSummary'
import Loading from './template.loading'
import ThreeDSHandlerCheckoutDotCom from './ThreeDSHandlerCheckoutDotCom'
import ThreeDSHandlerEverypay from './ThreeDSHandlerEverypay'
import ThreeDSHandlerFakeCardAcquirer from './ThreeDSHandlerFakeCardAcquirer'
import ThreeDSHandlerStripe from './ThreeDSHandlerStripe'
import UpdateSecurityCode from './UpdateSecurityCode'
import UpgradeToGold from './UpgradeToGold'

const { FORM_BS_CHECKOUT, FORMS_BS_BILLING_ADDRESS } = model.components.buySell

class BuySell extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = { show: false }
    this.backToEnterAmount = this.backToEnterAmount.bind(this)
  }

  componentDidMount() {
    this.setState({ show: true })
    this.props.recurringBuyActions.fetchPaymentInfo()
  }

  componentWillUnmount() {
    this.props.buySellActions.pollBalances()
    this.props.buySellActions.stopPollSellQuotePrice({})
    this.props.buySellActions.destroyCheckout()
    this.props.formActions.destroy(FORM_BS_CHECKOUT)
    this.props.formActions.destroy(FORMS_BS_BILLING_ADDRESS)
  }

  backToEnterAmount = () => {
    if (this.props.pair) {
      this.props.buySellActions.setStep({
        cryptoCurrency: getCoinFromPair(this.props.pair.pair),
        fiatCurrency: getFiatFromPair(this.props.pair.pair),
        method: this.props.method,
        orderType: this.props.orderType,
        pair: this.props.pair,
        step: getEnterAmountStepType(this.props.orderType)
      })
    }
  }

  paymentErrorHandler = () => {
    switch (this.props.reason) {
      case 'REQUIRES_UPDATE':
        this.props.brokerageActions.showModal({
          modalType: ModalName.ADD_BANK_PLAID_MODAL,
          origin: BrokerageModalOriginType.ADD_BANK_BUY
        })
        this.props.brokerageActions.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK
        })
        this.props.brokerageActions.setReason(undefined)
        this.backToEnterAmount()
        break
      case 'INSUFFICIENT_BALANCE':
      case 'GENERIC':
      case 'STALE_BALANCE':
      default:
        this.props.brokerageActions.setReason(undefined)
        this.backToEnterAmount()
        break
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    const buySellGoal = find(propEq('name', 'buySell'), this.props.goals)
    const goalID = propOr('', 'id', buySellGoal) as string
    if (!isEmpty(goalID)) {
      this.props.deleteGoal(goalID)
    }
    setTimeout(() => {
      this.props.close(ModalName.SIMPLE_BUY_MODAL)
    }, duration)
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='buySellModal'
        >
          <Loading />
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='buySellModal'
        >
          <Loading />
        </Flyout>
      ),
      Success: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='buySellModal'
        >
          {this.props.step === 'ENTER_AMOUNT' && (
            <FlyoutChild>
              <EnterAmount {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'SELL_ENTER_AMOUNT' && (
            <FlyoutChild>
              <SellEnterAmount {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'UPDATE_SECURITY_CODE' && (
            <FlyoutChild>
              <UpdateSecurityCode
                backToEnterAmount={this.backToEnterAmount}
                handleClose={this.handleClose}
              />
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
          {this.props.step === 'LINKED_PAYMENT_ACCOUNTS' && (
            <FlyoutChild>
              <LinkedPaymentAccounts {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'DETERMINE_CARD_PROVIDER' && (
            <FlyoutChild>
              <Loading />
            </FlyoutChild>
          )}
          {this.props.step === 'ADD_CARD_VGS' && (
            <FlyoutChild>
              <AddCardVgs handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'ADD_CARD_CHECKOUTDOTCOM' && (
            <FlyoutChild>
              <AddCardCheckoutDotCom {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === '3DS_HANDLER_FAKE_CARD_ACQUIRER' && (
            <FlyoutChild>
              <ThreeDSHandlerFakeCardAcquirer {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === '3DS_HANDLER_EVERYPAY' && (
            <FlyoutChild>
              <ThreeDSHandlerEverypay {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === '3DS_HANDLER_CHECKOUTDOTCOM' && (
            <FlyoutChild>
              <ThreeDSHandlerCheckoutDotCom {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === '3DS_HANDLER_STRIPE' && (
            <FlyoutChild>
              <ThreeDSHandlerStripe {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'BILLING_ADDRESS' && (
            <FlyoutChild>
              <BillingAddress {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'AUTHORIZE_PAYMENT' && (
            <FlyoutChild>
              <Authorize {...this.props} handleClose={this.handleClose} />
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
          {/*
                used for sell only now, eventually buy as well
                TODO: use swap2 quote for buy AND sell
            */}
          {this.props.step === 'PREVIEW_SELL' && (
            <FlyoutChild>
              <PreviewSell {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'SELL_ORDER_SUMMARY' && (
            <FlyoutChild>
              <SellOrderSummary {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'BANK_WIRE_DETAILS' && (
            <FlyoutChild>
              <BankWireDetails {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'OPEN_BANKING_CONNECT' && (
            <FlyoutChild>
              <OpenBankingConnect {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'KYC_REQUIRED' && (
            <FlyoutChild>
              <KycRequired {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'UPGRADE_TO_GOLD' && (
            <FlyoutChild>
              <UpgradeToGold {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'FREQUENCY' && (
            <FlyoutChild>
              <Frequency
                {...this.props}
                backToEnterAmount={this.backToEnterAmount}
                handleClose={this.handleClose}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'LOADING' && (
            <FlyoutChild>
              <StdLoading text={LoadingTextEnum.GETTING_READY} />
            </FlyoutChild>
          )}
          {this.props.step === 'INITIAL_LOADING' && (
            <FlyoutChild>
              <Loading />
            </FlyoutChild>
          )}
          {/** Only Plaid errors for now */}
          {this.props.step === 'PAYMENT_ACCOUNT_ERROR' && (
            <FlyoutChild>
              <PaymentAccountError
                reason={this.props.reason}
                buttonHandler={this.paymentErrorHandler}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'CONFIRMING_BUY_ORDER' && (
            <FlyoutChild>
              <ConfirmingBuyOrder />
            </FlyoutChild>
          )}
        </Flyout>
      )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  addBank: selectors.components.buySell.getAddBank(state),
  cardId: selectors.components.buySell.getBSCardId(state),
  cryptoCurrency: selectors.components.buySell.getCryptoCurrency(state),
  data: getData(state),
  displayBack: selectors.components.buySell.getDisplayBack(state),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state),
  goals: selectors.goals.getGoals(state),
  isFirstLogin: selectors.signup.getFirstLogin(state),
  method: selectors.components.buySell.getBSPaymentMethod(state),
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state),
  orderType: selectors.components.buySell.getOrderType(state),
  pair: selectors.components.buySell.getBSPair(state),
  reason: selectors.components.buySell.getReason(state),
  step: selectors.components.buySell.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  formActions: bindActionCreators(actions.form, dispatch),
  preferenceActions: bindActionCreators(actions.preferences, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.SIMPLE_BUY_MODAL, { fixed: true, transition: duration }),
  connector
)

type OwnProps = ModalPropsType
export type LinkDispatchPropsType = {
  buySellActions: typeof actions.components.buySell
  formActions: typeof actions.form
  profileActions: typeof actions.modules.profile
  settingsActions: typeof actions.modules.settings
}
type LinkStatePropsType =
  | {
      step:
        | 'CRYPTO_SELECTION'
        | '3DS_HANDLER_EVERYPAY'
        | '3DS_HANDLER_CHECKOUTDOTCOM'
        | '3DS_HANDLER_STRIPE'
        | '3DS_HANDLER_FAKE_CARD_ACQUIRER'
        | 'BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'INITIAL_LOADING'
        | 'LOADING'
        | 'FREQUENCY'
        | 'SELL_ORDER_SUMMARY'
        | 'ORDER_SUMMARY'
        | 'OPEN_BANKING_CONNECT'
        | 'AUTHORIZE_PAYMENT'
        | 'UPDATE_SECURITY_CODE'
        | 'CONFIRMING_BUY_ORDER'
    }
  | {
      pair: BSPairType
      step: 'CHECKOUT_CONFIRM'
    }
  | {
      orderType: BSOrderActionType
      pair: BSPairType
      step: 'PREVIEW_SELL'
    }
  | {
      addBank?: boolean
      displayBack: boolean
      fiatCurrency: FiatType
      pair: BSPairType
      step: 'BANK_WIRE_DETAILS'
    }
  | {
      cryptoCurrency: CoinType
      fastLink: FastLinkType
      pair: BSPairType
      step: BSPaymentTypes.LINK_BANK
    }
  | {
      bankStatus: BankStatusType
      step: 'LINK_BANK_STATUS'
    }
  | {
      step: 'DETERMINE_CARD_PROVIDER'
    }
  | {
      cardTokenId: string
      step: 'ADD_CARD_VGS'
      vgsVaultId: string
    }
  | {
      cardId?: string
      cryptoCurrency?: CoinType
      pair: BSPairType
      step: 'ADD_CARD_CHECKOUTDOTCOM'
    }
  | {
      goals: Array<{ data: any; id: string; name: GoalsType }>
      method?: BSPaymentMethodType
      mobilePaymentMethod?: MobilePaymentType
      order?: BSOrderType
      orderType: BSOrderActionType
      pair: BSPairType
      step: 'ENTER_AMOUNT' | 'SELL_ENTER_AMOUNT'
    }
  | {
      orderType: BSOrderActionType
      pair: BSPairType
      step: 'PAYMENT_METHODS'
    }
  | {
      reason: PlaidSettlementErrorReasons
      step: 'PAYMENT_ACCOUNT_ERROR'
    }
  | {
      orderType: BSOrderActionType
      pair: BSPairType
      step: 'LINKED_PAYMENT_ACCOUNTS'
    }

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector> & { children: never }
type State = { show: boolean }

export default enhance(BuySell)
