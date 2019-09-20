export const header = message => message.entity === 'header' && message.header
export const ethSentPending = message =>
  message.transaction &&
  message.address === message.transaction.from &&
  message.transaction.state === 'pending'
export const ethSentConfirmed = message =>
  message.transaction &&
  message.address === message.transaction.from &&
  message.transaction.state === 'confirmed'
export const ethReceivedPending = message =>
  message.transaction &&
  message.address === message.transaction.to &&
  message.transaction.state === 'pending'
export const ethReceivedConfirmed = message =>
  message.transaction &&
  message.address === message.transaction.to &&
  message.transaction.state === 'confirmed'
export const bitcoinTransaction = message =>
  message.transaction && message.entity === 'xpub'
