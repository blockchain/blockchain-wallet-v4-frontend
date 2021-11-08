import { InvitationsType } from './types'

export const DEFAULT_INVITATIONS: InvitationsType = {
  BCH: true,
  BTC: true,
  ETH: true,
  XLM: true,
  achDepositWithdrawal: false,
  openBanking: false,
  segwit: false,
  withdrawalLocksFundsOnHold: true
}

export default DEFAULT_INVITATIONS
