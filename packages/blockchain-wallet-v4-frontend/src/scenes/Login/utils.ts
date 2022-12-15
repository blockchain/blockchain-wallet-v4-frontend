export const getTwoFaType = (authType: number): string | null => {
  if (authType > 0) {
    if (authType === 1) return 'YUBIKEY'
    if (authType === 4 || authType === 5) return 'SMS'
    return 'OTP_CODE'
  }
  return null
}
