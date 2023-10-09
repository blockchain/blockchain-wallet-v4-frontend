// Log in Events
export enum Events {
  NO_VULNERABLE_FUNDS_SHOWN = 'Not Vulnerable Modal Is Shown',
  TRANSFER_FUNDS_CLICKED = 'Transfer Funds CTA Is Clicked',
  TRANSFER_FUNDS_FAILURE = 'Transfer Funds Failure',
  TRANSFER_FUNDS_MODAL_SHOWN = 'Transfer Funds Modal Is Shown',
  TRANSFER_FUNDS_SUCCESS = 'Transfer Funds Success'
}

type TransferFundsModalShwon = {
  key: Events.TRANSFER_FUNDS_MODAL_SHOWN
  properties: {}
}

type TransferFundsClicked = {
  key: Events.TRANSFER_FUNDS_CLICKED
  properties: {}
}

type TransferFundsSuccess = {
  key: Events.TRANSFER_FUNDS_SUCCESS
  properties: {}
}

type TransferFundsFailure = {
  key: Events.TRANSFER_FUNDS_FAILURE
  properties: {}
}

type NoVulnerableFundsShown = {
  key: Events.NO_VULNERABLE_FUNDS_SHOWN
  properties: {}
}

export type TrackEventAction =
  | TransferFundsModalShwon
  | TransferFundsClicked
  | TransferFundsSuccess
  | TransferFundsFailure
  | NoVulnerableFundsShown
