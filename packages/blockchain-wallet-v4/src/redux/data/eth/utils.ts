export const constructDefaultErc20Data = (
  accountHash: string,
  tokenHash: string
) => ({
  accountHash,
  tokenHash,
  balance: '0',
  totalSent: '0',
  totalReceived: '0',
  decimals: 8,
  transferCount: '0'
})
