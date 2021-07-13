import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { getCoinFromPair, getFiatFromPair } from './model'
import { SimpleBuyActionTypes, SimpleBuyState } from './types'

const INITIAL_STATE: SimpleBuyState = {
  addBank: undefined,
  account: Remote.NotAsked,
  balances: Remote.NotAsked,
  card: Remote.NotAsked,
  cardId: undefined,
  cards: Remote.NotAsked,
  cryptoCurrency: undefined,
  displayBack: false,
  everypay3DS: Remote.NotAsked,
  fiatCurrency: undefined,
  fiatEligible: Remote.NotAsked,
  method: undefined,
  methods: Remote.NotAsked,
  order: undefined,
  orders: Remote.NotAsked,
  orderType: undefined,
  pair: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  providerDetails: Remote.NotAsked,
  quote: Remote.NotAsked,
  sddEligible: Remote.NotAsked,
  sddVerified: Remote.NotAsked,
  sddTransactionFinished: false,
  sellOrder: undefined,
  sellQuote: Remote.NotAsked,
  step: 'CRYPTO_SELECTION',
  swapAccount: undefined,
  limits: Remote.NotAsked
}

export function simpleBuyReducer(
  state = INITIAL_STATE,
  action: SimpleBuyActionTypes
): SimpleBuyState {
  switch (action.type) {
    case AT.ACTIVATE_SB_CARD_FAILURE: {
      return {
        ...state,
        providerDetails: Remote.Failure(action.payload.error)
      }
    }
    case AT.ACTIVATE_SB_CARD_LOADING:
      return {
        ...state,
        providerDetails: Remote.Loading
      }
    case AT.ACTIVATE_SB_CARD_SUCCESS:
      return {
        ...state,
        providerDetails: Remote.Success(action.payload.providerDetails)
      }
    case AT.ADD_CARD_DETAILS_FAILURE: {
      return {
        ...state,
        everypay3DS: Remote.Failure(action.payload.error)
      }
    }
    case AT.ADD_CARD_DETAILS_LOADING:
      return {
        ...state,
        everypay3DS: Remote.Loading
      }
    case AT.ADD_CARD_DETAILS_SUCCESS:
      return {
        ...state,
        everypay3DS: Remote.Success(action.payload.everypay3DS)
      }
    case AT.DESTROY_CHECKOUT:
      return {
        ...state,
        account: Remote.NotAsked,
        cardId: undefined,
        order: undefined,
        pairs: Remote.NotAsked,
        quote: Remote.NotAsked,
        step: 'CRYPTO_SELECTION'
      }
    case AT.FETCH_SB_BALANCES_FAILURE: {
      return {
        ...state,
        balances: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_BALANCES_LOADING:
      return {
        ...state,
        balances: Remote.Loading
      }
    case AT.FETCH_SB_BALANCES_SUCCESS:
      return {
        ...state,
        balances: Remote.Success(action.payload.balances)
      }
    case AT.FETCH_SB_CARD_FAILURE: {
      return {
        ...state,
        card: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_CARD_LOADING:
      return {
        ...state,
        card: Remote.Loading
      }
    case AT.FETCH_SB_CARD_SUCCESS:
      return {
        ...state,
        card: Remote.Success(action.payload.card)
      }
    // cards fetch fails so often in staging that this is a temp fix
    case AT.FETCH_SB_CARDS_FAILURE: {
      return {
        ...state,
        cards: Remote.Success([])
      }
    }
    case AT.FETCH_SB_CARDS_LOADING:
      return {
        ...state,
        cards: Remote.Loading
      }
    case AT.FETCH_SB_CARDS_SUCCESS:
      return {
        ...state,
        cards: Remote.Success(action.payload.cards)
      }
    case AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE: {
      return {
        ...state,
        fiatEligible: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_FIAT_ELIGIBLE_LOADING:
      return {
        ...state,
        fiatEligible: Remote.Loading
      }
    case AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS:
      return {
        ...state,
        fiatEligible: Remote.Success(action.payload.fiatEligible)
      }
    case AT.FETCH_SB_ORDERS_FAILURE: {
      return {
        ...state,
        orders: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_ORDERS_LOADING:
      return {
        ...state,
        orders: Remote.Loading
      }
    case AT.FETCH_SB_ORDERS_SUCCESS:
      return {
        ...state,
        orders: Remote.Success(action.payload.orders)
      }
    case AT.FETCH_SB_PAIRS_FAILURE: {
      return {
        ...state,
        pairs: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAIRS_LOADING:
      return {
        ...state,
        pairs: Remote.Loading
      }
    case AT.FETCH_SB_PAIRS_SUCCESS:
      return {
        ...state,
        pairs: Remote.Success(action.payload.pairs),
        pair: action.payload.coin
          ? action.payload.pairs.find(
              pair =>
                getCoinFromPair(pair.pair) === action.payload.coin &&
                getFiatFromPair(pair.pair) === state.fiatCurrency
            )
          : state.pair
      }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_FAILURE: {
      return {
        ...state,
        account: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_LOADING:
      return {
        ...state,
        account: Remote.Loading
      }
    case AT.FETCH_SB_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: Remote.Success(action.payload.account)
      }
    case AT.FETCH_SB_PAYMENT_METHODS_FAILURE: {
      return {
        ...state,
        methods: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAYMENT_METHODS_LOADING:
      return {
        ...state,
        methods: Remote.Loading
      }
    case AT.FETCH_SB_PAYMENT_METHODS_SUCCESS:
      return {
        ...state,
        methods: Remote.Success(action.payload.methods)
      }
    case AT.FETCH_SB_QUOTE_FAILURE: {
      return {
        ...state,
        quote: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_QUOTE_LOADING:
      return {
        ...state,
        quote: Remote.Loading
      }
    case AT.FETCH_SB_QUOTE_SUCCESS:
      return {
        ...state,
        quote: Remote.Success(action.payload.quote)
      }
    // used for sell only now, eventually buy as well
    // TODO: use swap2 quote for buy AND sell
    case AT.FETCH_SELL_QUOTE_FAILURE: {
      return {
        ...state,
        sellQuote: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SELL_QUOTE_LOADING:
      return {
        ...state,
        sellQuote: Remote.Loading
      }
    case AT.FETCH_SELL_QUOTE_SUCCESS:
      return {
        ...state,
        sellQuote: Remote.Success({
          quote: action.payload.quote,
          rate: action.payload.rate
        })
      }
    case AT.FETCH_SDD_ELIGIBILITY_FAILURE: {
      return {
        ...state,
        sddEligible: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SDD_ELIGIBILITY_LOADING:
      return {
        ...state,
        sddEligible: Remote.Loading
      }
    case AT.FETCH_SDD_ELIGIBILITY_SUCCESS:
      return {
        ...state,
        sddEligible: Remote.Success(action.payload.sddEligible)
      }
    case AT.FETCH_SDD_VERIFIED_FAILURE: {
      return {
        ...state,
        sddVerified: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_LIMITS_FAILURE: {
      return {
        ...state,
        limits: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_LIMITS_LOADING:
      return {
        ...state,
        limits: Remote.Loading
      }
    case AT.FETCH_LIMITS_SUCCESS:
      return {
        ...state,
        limits: Remote.Success(action.payload.limits)
      }
    case AT.FETCH_SDD_VERIFIED_LOADING:
      return {
        ...state,
        sddVerified: Remote.Loading
      }
    case AT.FETCH_SDD_VERIFIED_SUCCESS:
      return {
        ...state,
        sddVerified: Remote.Success(action.payload.sddVerified)
      }
    case AT.INITIALIZE_CHECKOUT:
      return {
        ...state,
        pair:
          action.pair ||
          action.pairs.find(
            pair =>
              getCoinFromPair(pair.pair) === state.cryptoCurrency &&
              getFiatFromPair(pair.pair) === state.fiatCurrency
          )
      }
    case AT.UPDATE_PAYMENT_FAILURE: {
      return {
        ...state,
        payment: Remote.Failure(action.payload.error)
      }
    }
    case AT.UPDATE_PAYMENT_LOADING: {
      return {
        ...state,
        payment: Remote.Loading
      }
    }
    case AT.UPDATE_PAYMENT_SUCCESS: {
      return {
        ...state,
        payment: Remote.Success(action.payload.payment)
      }
    }
    case AT.UPDATE_SDD_TRANSACTION_FINISHED: {
      return {
        ...state,
        sddTransactionFinished: true
      }
    }
    case AT.SET_FIAT_CURRENCY:
      return {
        ...state,
        fiatCurrency: action.payload.fiatCurrency
      }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'ENTER_AMOUNT':
        case 'VERIFY_EMAIL':
          return {
            ...state,
            orderType: action.payload.orderType,
            swapAccount: action.payload.swapAccount,
            cryptoCurrency: action.payload.cryptoCurrency,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step,
            pair: action.payload.pair,
            method: action.payload.method,
            order: undefined,
            addBank: undefined
          }
        case 'CRYPTO_SELECTION':
          return {
            ...state,
            cryptoCurrency: action.payload.cryptoCurrency,
            fiatCurrency: action.payload.fiatCurrency,
            orderType: action.payload.orderType,
            step: action.payload.step,
            swapAccount: undefined,
            addBank: undefined
          }
        case 'LINKED_PAYMENT_ACCOUNTS':
        case 'PAYMENT_METHODS':
          return {
            ...state,
            cryptoCurrency: action.payload.cryptoCurrency,
            fiatCurrency: action.payload.fiatCurrency,
            step: action.payload.step,
            order: action.payload.order,
            addBank: undefined
          }
        case '3DS_HANDLER':
        case 'CHECKOUT_CONFIRM':
        case 'OPEN_BANKING_CONNECT':
        case 'ORDER_SUMMARY':
          return {
            ...state,
            order: action.payload.order,
            step: action.payload.step,
            addBank: undefined
          }
        case 'BANK_WIRE_DETAILS':
          return {
            ...state,
            step: action.payload.step,
            fiatCurrency: action.payload.fiatCurrency,
            displayBack: action.payload.displayBack,
            addBank: action.payload.addBank
          }
        case 'SELL_ORDER_SUMMARY':
          return {
            ...state,
            step: action.payload.step,
            sellOrder: action.payload.sellOrder
          }
        case 'LOADING':
        default: {
          return {
            ...state,
            step: action.payload.step
          }
        }
      }
    default:
      return state
  }
}
