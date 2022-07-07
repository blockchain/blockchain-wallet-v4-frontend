export const isApplePayAvailable = (): boolean =>
  (window.ApplePaySession && ApplePaySession?.canMakePayments()) || false
