export const constructDefaultErc20Data = (
  accountHash: string,
  tokenHash: string,
  tokenSymbol: string,
  balance?: string
) => ({
  accountHash,
  balance: balance || '0',
  decimals: 8,
  tokenHash,
  tokenSymbol,
  totalReceived: '0',
  totalSent: '0',
  transferCount: '0'
})
