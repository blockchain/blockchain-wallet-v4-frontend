export function isOnDotCom (domains) {
  if (domains == null) throw new Error('isOnDotCom expects env domains')
  return window.location.origin === domains.comWalletApp
}

export function isOnDotInfo (domains) {
  if (domains == null) throw new Error('isOnDotInfo expects env domains')
  return window.location.origin === domains.root
}
