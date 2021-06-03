import * as crypto from 'crypto'
import { PaymentType } from 'middleware/analyticsMiddleware/types'

import { PaymentValue, SBPaymentTypes } from 'core/types'
import { SBShowModalOriginType } from 'data/types'

const simpleBuyOriginDictionary = (rawOrigin: SBShowModalOriginType | string) => {
  switch (rawOrigin) {
    case 'InterestPage':
      return 'SAVINGS'
    case 'PendingOrder':
      return 'PENDING_ORDER'
    case 'SideNav':
      return 'NAVIGATION'
    case 'WelcomeModal':
      return 'WELCOME'
    case 'PriceChart':
      return 'PRICE_CHART'
    case 'SimpleBuyLink':
      return 'BUY_WIDGET'
    case 'CurrencyList':
      return 'CURRENCY_PAGE'
    default: {
      return rawOrigin
    }
  }
}

const simpleBuyPaymentTypeDictionary = (rawPaymentType: SBPaymentTypes): PaymentType => {
  switch (rawPaymentType) {
    case 'USER_CARD': {
      return PaymentType.PAYMENT_CARD
    }
    case 'LINK_BANK': {
      return PaymentType.BANK_ACCOUNT
    }
    case 'BANK_ACCOUNT': {
      return PaymentType.BANK_ACCOUNT
    }
    case 'FUNDS': {
      return PaymentType.FUNDS
    }
    case 'BANK_TRANSFER': {
      return PaymentType.BANK_TRANSFER
    }
    default: {
      return PaymentType.BANK_ACCOUNT
    }
  }
}

const getOriginalTimestamp = () => new Date().toISOString()

const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

const generateUniqueUserId = (guid: string) => {
  return sha256(guid).toString('base64')
}

const getNetworkFee = (value: PaymentValue | undefined) => {
  return value
    ? value.coin === 'BTC' || value.coin === 'BCH'
      ? value.selection?.fee
      : value.fee
    : 0
}

export {
  generateUniqueUserId,
  getNetworkFee,
  getOriginalTimestamp,
  simpleBuyOriginDictionary,
  simpleBuyPaymentTypeDictionary
}
