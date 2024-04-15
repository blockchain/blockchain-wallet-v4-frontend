export const LINK_BACK_TO_APP =
  'https://blockchain.page.link/?link=https://login.blockchain.com/#/&apn=piuk.blockchain.android&isi=493253309&ibi=com.rainydayapps.Blockchain'

export const VFP_STORE_URL = '/nabu-gateway/onboarding/prove/possession/instant-link/vfp-store'

export const TEXT_ELEMENTS = (isBcPay: boolean) => ({
  error: {
    description: isBcPay
      ? 'Close this tab, and return to Blockchain.com Pay to get a new link and continue with the verification process.'
      : 'Return to the Blockchain.com App to get a new one and continue with the verification process.',
    iconProps: {
      color: 'error',
      name: 'close-circle'
    },
    title: 'Your link has expired'
  },
  verified: {
    description: isBcPay
      ? 'Close this tab, and return to Blockchain.com Pay to continue with the verification process.'
      : 'Return to the Blockchain.com App to continue with the verification process.',
    iconProps: {
      color: 'success',
      name: 'checkmark-circle-filled'
    },
    title: 'Your device is verified!'
  }
})
