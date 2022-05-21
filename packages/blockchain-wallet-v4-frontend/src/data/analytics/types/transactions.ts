export enum Events {
  TRANSACTIONS_BUY_BUTTON_CLICKED = 'Transactions Buy Button Clicked',
  TRANSACTIONS_EARN_BUTTON_CLICKED = 'Transactions Earn Button Clicked',
  TRANSACTIONS_SELL_BUTTON_CLICKED = 'Transactions Sell Button Clicked'
}

type TransactionsBuyButtonClick = {
  key: Events.TRANSACTIONS_BUY_BUTTON_CLICKED
  properties: {
    coin: string
  }
}

type TransactionsSellButtonClick = {
  key: Events.TRANSACTIONS_SELL_BUTTON_CLICKED
  properties: {
    coin: string
  }
}

type TransactionsEarnButtonClick = {
  key: Events.TRANSACTIONS_EARN_BUTTON_CLICKED
  properties: {
    coin: string
  }
}

export type TrackEventAction =
  | TransactionsBuyButtonClick
  | TransactionsSellButtonClick
  | TransactionsEarnButtonClick
