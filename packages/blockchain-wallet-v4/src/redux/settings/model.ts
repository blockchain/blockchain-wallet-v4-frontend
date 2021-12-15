import { InvitationsType } from './types'

export const DEFAULT_INVITATIONS: InvitationsType = {
  BCH: true,
  BTC: true,
  ETH: true,
  XLM: true,
  achDepositWithdrawal: false,
  isRedesignEnabled: false,
  nfts: false,
  openBanking: false,
  segwit: true,
  withdrawalLocksFundsOnHold: true
}

export default DEFAULT_INVITATIONS
