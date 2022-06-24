export enum Events {
  // BUY: Wallet. The user clicks the buy earn rewards button.
  WALLET_BUY_EARN_REWARDS_CLICKED = 'Wallet Buy Earn Rewards Clicked',
  // BUY: Wallet. What the user sees after the wallet clicks the Buy Earn Rewards Button
  WALLET_BUY_EARN_REWARDS_VIEWED = 'Wallet Buy Earn Rewards Viewed',
  // ADD: User changes the wallet on the interest deposit page.
  WALLET_REWARDS_DEPOSIT_CHANGE_WALLET_CLICKED = 'Wallet Rewards Deposit Change Wallet Clicked',
  // ADD: User clicks on transfer on the deposit page.
  WALLET_REWARDS_DEPOSIT_TRANSFER_CLICKED = 'Wallet Rewards Deposit Transfer Clicked',
  // ADD: User visualises the page where he add balance to the rewards account.
  WALLET_REWARDS_DEPOSIT_VIEWED = 'Interest Deposit Viewed',
  // DETAIL: User clicks in the buy button in the interest detail view.
  WALLET_REWARDS_DETAIL_BUY_CLICKED = 'Wallet Rewards Detail Buy Clicked',
  // REWARDS HOMEPAGE: User clicks in an interest token in the rewards page.
  WALLET_REWARDS_DETAIL_CLICKED = 'Wallet Rewards Detail Clicked',
  // DETAIL: User clicks in the deposit button in the interest detail view.
  WALLET_REWARDS_DETAIL_DEPOSIT_CLICKED = 'Wallet Rewards Detail Deposit Clicked',
  // DETAIL: User visualises the detail of a specific token’s rewards account. Balance, accruals, and CTA are shown here.
  WALLET_REWARDS_DETAIL_VIEWED = 'Wallet Rewards Detail Viewed',
  // ADD: Should be triggered whenever a user clicks on both boxes, not when the transfer is triggered.
  WALLET_REWARDS_SUBMIT_INFORMATION_CLICKED = 'Wallet Rewards Submit Information Clicked',
  // REWARDS HOMEPAGE: User clicks in the button to visualise his Interest transaction history.
  WALLET_REWARDS_TRANSACTION_HISTORY_CLICKED = 'Wallet Rewards Transaction History Clicked',
  // REWARDS HOMEPAGE: User click on the download button in transaction history.
  WALLET_REWARDS_TRANSACTION_HISTORY_DOWNLOAD_CLICKED = 'Wallet Rewards Transaction History Download Clicked',
  // WITHDRAW: User changes the wallet on the interest withdrawal page.
  WALLET_REWARDS_WITHDRAW_CHANGE_WALLET_CLICKED = 'Wallet Rewards Withdraw Change Wallet Clicked',
  // WITHDRAW: User clicks in Max amount button in the withdrawal page.
  WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED = 'Wallet Rewards Withdraw Max Amount Clicked',
  // WITHDRAW: User clicks on transfer on the withdrawal page.
  WALLET_REWARDS_WITHDRAW_TRANSFER_CLICKED = 'Wallet Rewards Withdraw Transfer Clicked'
}

// REWARDS HOMEPAGE
type WalletRewardsDetailClicked = {
  key: Events.WALLET_REWARDS_DETAIL_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsTransactionHistoryClicked = {
  key: Events.WALLET_REWARDS_TRANSACTION_HISTORY_CLICKED
  properties: {}
}

type WalletRewardsTransactionHistoryDownloadClicked = {
  key: Events.WALLET_REWARDS_TRANSACTION_HISTORY_DOWNLOAD_CLICKED
  properties: {
    currency: string
  }
}

// DETAIL
type WalletRewardsDetailBuyClicked = {
  key: Events.WALLET_REWARDS_DETAIL_BUY_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsDetailDepositClicked = {
  key: Events.WALLET_REWARDS_DETAIL_DEPOSIT_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsDetailViewed = {
  key: Events.WALLET_REWARDS_DETAIL_VIEWED
  properties: {
    currency: string
  }
}

// ADD
type WalletRewardsDepositChangeWalletClicked = {
  key: Events.WALLET_REWARDS_DEPOSIT_CHANGE_WALLET_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsDepositTransferClicked = {
  key: Events.WALLET_REWARDS_DEPOSIT_TRANSFER_CLICKED
  properties: {
    amount: number
    amount_usd: number
    currency: string
    type: 'TRADING' | 'USERKEY'
  }
}

type WalletRewardsDepositViewed = {
  key: Events.WALLET_REWARDS_DEPOSIT_VIEWED
  properties: {
    currency?: string
    path?: string
    referrer?: string
    search?: string
    title?: string
    url?: string
  }
}

type WalletRewardsSubmitInformationClicked = {
  key: Events.WALLET_REWARDS_SUBMIT_INFORMATION_CLICKED
  properties: {
    currency: string
    origin: 'SAVINGS_CONFIRMATION' | 'SAVINGS_PAGE'
  }
}

// WITHDRAW
type WalletRewardsWithdrawChangeWalletClicked = {
  key: Events.WALLET_REWARDS_WITHDRAW_CHANGE_WALLET_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsWithdrawMaxAmountClicked = {
  key: Events.WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED
  properties: {
    currency: string
  }
}

type WalletRewardsWithdrawTransferClicked = {
  key: Events.WALLET_REWARDS_WITHDRAW_TRANSFER_CLICKED
  properties: {
    amount: number
    amount_usd: number
    currency: string
    type: 'TRADING' | 'USERKEY'
  }
}

// BUY
type WalletBuyEarnRewardsClicked = {
  key: Events.WALLET_BUY_EARN_REWARDS_CLICKED
  properties: {}
}

type WalletBuyEarnRewardsViewed = {
  key: Events.WALLET_BUY_EARN_REWARDS_VIEWED
  properties: {}
}

export type TrackEventAction =
  | WalletRewardsDetailClicked
  | WalletRewardsTransactionHistoryClicked
  | WalletRewardsTransactionHistoryDownloadClicked
  | WalletRewardsDetailBuyClicked
  | WalletRewardsDetailDepositClicked
  | WalletRewardsDetailViewed
  | WalletRewardsDepositChangeWalletClicked
  | WalletRewardsDepositTransferClicked
  | WalletRewardsDepositViewed
  | WalletRewardsSubmitInformationClicked
  | WalletRewardsWithdrawChangeWalletClicked
  | WalletRewardsWithdrawMaxAmountClicked
  | WalletRewardsWithdrawTransferClicked
  | WalletBuyEarnRewardsClicked
  | WalletBuyEarnRewardsViewed
