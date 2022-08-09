export const isApplePayAvailable = (): boolean => {
  if (!window.ApplePaySession) return false

  try {
    return ApplePaySession?.canMakePayments()
  } catch (err) {
    console.error(err)

    return false
  }
}
