export type TokenAllowanceProps = {
  baseToken: string
  gasEstimate: string
  handleApprove: () => void
  handleClose: () => void
  isLoading: boolean
  isNotAsked: boolean
}
