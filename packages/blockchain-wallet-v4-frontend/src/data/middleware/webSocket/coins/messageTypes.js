export const header = message => message.entity === 'header' && message.header
export const btcTransaction = message =>
  message.transaction && message.entity === 'xpub'
export const ethSentPending = message =>
  checkMessage(message, 'pending', 'from')
export const ethSentConfirmed = message =>
  checkMessage(message, 'confirmed', 'from')
export const ethReceivedPending = message =>
  checkMessage(message, 'pending', 'to')
export const ethReceivedConfirmed = message =>
  checkMessage(message, 'confirmed', 'to')

const checkMessage = (message, state, direction) => {
  const { address, transaction } = message
  return (
    transaction &&
    address === transaction[direction] &&
    transaction.state === state
  )
}
