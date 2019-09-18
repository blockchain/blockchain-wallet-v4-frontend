export const header = message => message.entity === 'header' && message.header
export const sentPending = message =>
  message.entity === 'account' &&
  message.txHash &&
  message.address === message.transaction.from &&
  message.transaction.state === 'pending'
export const sentConfirmed = message =>
  message.entity === 'account' &&
  message.txHash &&
  message.address === message.transaction.from &&
  message.transaction.state === 'confirmed'
export const receivedPending = message =>
  message.entity === 'account' &&
  message.txHash &&
  message.address === message.transaction.to &&
  message.transaction.state === 'pending'
export const receivedConfirmed = message =>
  message.entity === 'account' &&
  message.txHash &&
  message.address === message.transaction.to &&
  message.transaction.state === 'confirmed'
