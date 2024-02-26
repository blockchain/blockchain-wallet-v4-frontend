export enum RecommendedSweepEvents {
  NO_VULNERABLE_FUNDS_SHOWN = 'Not Vulnerable Modal Is Shown',
  TRANSFER_FUNDS_CLICKED = 'Transfer Funds CTA Is Clicked',
  TRANSFER_FUNDS_FAILURE = 'Transfer Funds Failure',
  TRANSFER_FUNDS_MODAL_SHOWN = 'Transfer Funds Modal Is Shown',
  TRANSFER_FUNDS_SUCCESS = 'Transfer Funds Success'
}

export type RecommendedSweepActions = {
  key: RecommendedSweepEvents
  properties: {}
}
