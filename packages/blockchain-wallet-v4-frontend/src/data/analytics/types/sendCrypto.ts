export enum SendCryptoEvents {
  SEND_AMOUNT_ENTERED = 'Send Amount Entered',
  SEND_FAILED = 'Send Failed Client',
  SEND_SUBMITTED = 'Send Submitted'
}

export type SendCryptoActions = {
  key: SendCryptoEvents
  properties: {}
}
