import { InvitationsType } from './types'

export const DEFAULT_INVITATIONS: InvitationsType = {
  BCH: true,
  BTC: true,
  ETH: true,
  XLM: true,
  achDepositWithdrawal: false,
  nfts: false,
  openBanking: false,
  segwit: true,
  stxSelfCustody: false,
  withdrawalLocksFundsOnHold: true
}

export default DEFAULT_INVITATIONS
