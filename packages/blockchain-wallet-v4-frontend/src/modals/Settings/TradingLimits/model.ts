export enum TIER_TYPES {
  NONE = 0,
  SILVER = 1,
  GOLD = 2,
  SILVER_PLUS = 3
}

export enum ITEMS {
  BUY_WITH_A_CARD = 'buy_with_a_card',
  CASH_ACCOUNT = 'cash_account',
  DEPOSIT_AND_WITHDRAWAL = 'deposit_and_withdrawal',
  EARN_INTEREST = 'earn_interest',
  RECEIVE = 'receive',
  SEND = 'send',
  SWAP = 'swap'
}

export const TIERS = {
  [TIER_TYPES.NONE]: {
    [ITEMS.SEND]: true,
    [ITEMS.RECEIVE]: true,
    [ITEMS.SWAP]: false,
    [ITEMS.CASH_ACCOUNT]: false,
    [ITEMS.BUY_WITH_A_CARD]: false,
    [ITEMS.DEPOSIT_AND_WITHDRAWAL]: false,
    [ITEMS.EARN_INTEREST]: false
  },
  [TIER_TYPES.SILVER]: {
    [ITEMS.SEND]: true,
    [ITEMS.RECEIVE]: true,
    [ITEMS.SWAP]: true,
    [ITEMS.CASH_ACCOUNT]: false,
    [ITEMS.BUY_WITH_A_CARD]: false,
    [ITEMS.DEPOSIT_AND_WITHDRAWAL]: false,
    [ITEMS.EARN_INTEREST]: false
  },
  [TIER_TYPES.GOLD]: {
    [ITEMS.SEND]: true,
    [ITEMS.RECEIVE]: true,
    [ITEMS.SWAP]: true,
    [ITEMS.CASH_ACCOUNT]: true,
    [ITEMS.BUY_WITH_A_CARD]: true,
    [ITEMS.DEPOSIT_AND_WITHDRAWAL]: true,
    [ITEMS.EARN_INTEREST]: true
  },
  [TIER_TYPES.SILVER_PLUS]: {
    [ITEMS.SEND]: true,
    [ITEMS.RECEIVE]: true,
    [ITEMS.SWAP]: true,
    [ITEMS.CASH_ACCOUNT]: false,
    [ITEMS.BUY_WITH_A_CARD]: true,
    [ITEMS.DEPOSIT_AND_WITHDRAWAL]: false,
    [ITEMS.EARN_INTEREST]: false
  }
}
