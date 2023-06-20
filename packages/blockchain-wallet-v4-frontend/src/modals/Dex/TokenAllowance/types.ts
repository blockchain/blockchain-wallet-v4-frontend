import { BigNumber } from 'ethers'

export type NonCustodialCoinInfoType = {
  address: string
  balance: number | BigNumber
}

export type TokenAllowanceProps = {
  balance: number | BigNumber
  baseToken: string
  gasEstimate: string
  handleApprove: () => void
  handleClose: () => void
  isLoading: boolean
  isNotAsked: boolean
  truncatedAddress: string
}
