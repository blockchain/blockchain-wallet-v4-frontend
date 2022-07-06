import { InvitationsType } from './types'

export const DEFAULT_INVITATIONS: InvitationsType = {
  BCH: true,
  BTC: true,
  ETH: true,
  XLM: true,
  achDepositWithdrawal: false,
  nftBuySell: false,
  openBanking: false,
  segwit: true,
  stxSelfCustody: false
}

export default DEFAULT_INVITATIONS
