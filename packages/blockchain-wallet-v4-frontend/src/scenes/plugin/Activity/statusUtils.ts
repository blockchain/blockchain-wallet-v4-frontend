export const getIsConfirmed = (blockHeight, txBlockHeight, coin) => {
  const conf = blockHeight - txBlockHeight + 1
  const confirmations = conf > 0 && txBlockHeight ? conf : 0
  const { coinfig } = window.coins[coin]
  const { parentChain = coin } = coinfig.type
  const { minimumOnChainConfirmations = 3 } = window.coins[parentChain].coinfig.type

  return confirmations >= minimumOnChainConfirmations
}
