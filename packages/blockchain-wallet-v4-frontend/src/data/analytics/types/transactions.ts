export enum Events {
  TRANSACTIONS_EARN_BUTTON_CLICKED = 'Transactions Earn Button Clicked'
}

type TransactionsEarnButtonClick = {
  key: Events.TRANSACTIONS_EARN_BUTTON_CLICKED
  properties: {
    coin: string
  }
}

export type TrackEventAction = TransactionsEarnButtonClick
