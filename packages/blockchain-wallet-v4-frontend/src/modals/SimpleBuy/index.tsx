import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, isEmpty, propEq, propOr } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  CoinType,
  FiatType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType,
  SBPaymentTypes,
  SwapOrderType
} from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { GoalsType } from 'data/goals/types'
import { RootState } from 'data/rootReducer'
import { BankStatusType, FastLinkType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading as StdLoading, LoadingTextEnum } from '../components'
import { ModalPropsType } from '../types'
// step templates
import AddCard from './AddCard'
import Authorize from './Authorize'
import BankWireDetails from './BankWireDetails'
import BillingAddress from './BillingAddress'
import CheckoutConfirm from './CheckoutConfirm'
import CryptoSelection from './CryptoSelection'
import EnterAmount from './EnterAmount'
import KycRequired from './KycRequired'
import LinkedPaymentAccounts from './LinkedPaymentAccounts'
import OpenBankingConnect from './OpenBankingConnect'
import OrderSummary from './OrderSummary'
import PaymentMethods from './PaymentMethods'
import PreviewSell from './PreviewSell'
import { getData } from './selectors'
import SellOrderSummary from './SellOrderSummary'
// step wrappers
import Loading from './template.loading'
import Pending from './template.pending'
import Rejected from './template.rejected'
import ThreeDSHandler from './ThreeDSHandler'
import UpgradeToGold from './UpgradeToGold'
import VerifyEmail from './VerifyEmail'

class SimpleBuy extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentWillUnmount() {
    this.props.simpleBuyActions.pollSBBalances()
    this.props.simpleBuyActions.destroyCheckout()
    this.props.formActions.destroy('simpleBuyCheckout')
    this.props.formActions.destroy('ccBillingAddress')
    this.props.formActions.destroy('addCCForm')
  }

  handleClose = () => {
    this.setState({ show: false })
    const simpleBuyGoal = find(propEq('name', 'simpleBuy'), this.props.goals)
    const goalID = propOr('', 'id', simpleBuyGoal) as string
    if (!isEmpty(goalID)) {
      this.props.deleteGoal(goalID)
    }
    setTimeout(() => {
      this.props.close()
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
          data-e2e='simpleBuyModal'
        >
          <Loading />
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='simpleBuyModal'
        >
          <Loading />
        </Flyout>
      ),
      Success: (val) => {
        const { userData } = val
        const { kycState } = userData
        const isUserRejectedOrExpired = kycState === 'REJECTED' || kycState === 'EXPIRED'
        const isUserPending = kycState === 'UNDER_REVIEW' || kycState === 'PENDING'

        return isUserRejectedOrExpired ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
            data-e2e='simpleBuyModal'
          >
            <Rejected handleClose={this.handleClose} />
          </Flyout>
        ) : isUserPending ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
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
            isOpen={this.state.show}
            data-e2e='simpleBuyModal'
          >
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
            {this.props.step === 'LINKED_PAYMENT_ACCOUNTS' && (
              <FlyoutChild>
                <LinkedPaymentAccounts {...this.props} handleClose={this.handleClose} />
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
            {this.props.step === 'VERIFY_EMAIL' && (
              <FlyoutChild>
                <VerifyEmail {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'UPGRADE_TO_GOLD' && (
              <FlyoutChild>
                <UpgradeToGold {...this.props} handleClose={this.handleClose} />
              </FlyoutChild>
            )}
            {this.props.step === 'LOADING' && (
              <FlyoutChild>
                <StdLoading text={LoadingTextEnum.GETTING_READY} />
              </FlyoutChild>
            )}
          </Flyout>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  addBank: selectors.components.simpleBuy.getAddBank(state),
  cardId: selectors.components.simpleBuy.getSBCardId(state),
  cryptoCurrency: selectors.components.simpleBuy.getCryptoCurrency(state),
  data: getData(state),
  displayBack: selectors.components.simpleBuy.getDisplayBack(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  goals: selectors.goals.getGoals(state),
  isFirstLogin: selectors.auth.getFirstLogin(state),
  method: selectors.components.simpleBuy.getSBPaymentMethod(state),
  order: selectors.components.simpleBuy.getSBOrder(state),
  orderType: selectors.components.simpleBuy.getOrderType(state),
  pair: selectors.components.simpleBuy.getSBPair(state),
  step: selectors.components.simpleBuy.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  formActions: bindActionCreators(actions.form, dispatch),
  preferenceActions: bindActionCreators(actions.preferences, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(ModalEnhancer('SIMPLE_BUY_MODAL', { transition: duration }), connector)

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
        | 'CRYPTO_SELECTION'
        | '3DS_HANDLER'
        | 'CC_BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'LOADING'
    }
  | {
      orderType: SBOrderActionType
      pair: SBPairType
      step: 'PREVIEW_SELL'
    }
  | {
      addBank?: boolean
      displayBack?: boolean
      fiatCurrency: FiatType
      pair: SBPairType
      step: 'BANK_WIRE_DETAILS'
    }
  | {
      order: SBOrderType
      step: 'CHECKOUT_CONFIRM' | 'ORDER_SUMMARY' | 'OPEN_BANKING_CONNECT' | 'AUTHORIZE_PAYMENT'
    }
  | { order: SwapOrderType; step: 'SELL_ORDER_SUMMARY' }
  | {
      cryptoCurrency: CoinType
      fastLink: FastLinkType
      pair: SBPairType
      step: SBPaymentTypes.LINK_BANK
    }
  | {
      bankStatus: BankStatusType
      order: SBOrderType
      step: 'LINK_BANK_STATUS'
    }
  | {
      cardId?: string
      cryptoCurrency?: CoinType
      pair: SBPairType
      step: 'ADD_CARD'
    }
  | {
      goals: Array<{ data: any; id: string; name: GoalsType }>
      method?: SBPaymentMethodType
      order?: SBOrderType
      orderType: SBOrderActionType
      pair: SBPairType
      step: 'ENTER_AMOUNT' | 'VERIFY_EMAIL'
    }
  | {
      order: SBOrderType
      orderType: SBOrderActionType
      pair: SBPairType
      step: 'PAYMENT_METHODS'
    }
  | {
      order: SBOrderType
      orderType: SBOrderActionType
      pair: SBPairType
      step: 'LINKED_PAYMENT_ACCOUNTS'
    }

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(SimpleBuy)
