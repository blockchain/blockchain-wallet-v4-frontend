import { filter, lift, not, startsWith } from 'ramda'

import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

import { FIRST_YEAR } from './model'

type BtcContext = {
  addresses: Array<string>
  bech32: Array<string>
  legacy: Array<string>
}

export const getReportYearOptions = () => {
  const CURRENT_YEAR = new Date().getFullYear()

  const availableYears = CURRENT_YEAR - FIRST_YEAR
  const options = [...new Array(availableYears)].map((_, i) => ({
    text: `${FIRST_YEAR + i}`,
    value: FIRST_YEAR + i
  }))

  // current year
  options.push({
    text: `${CURRENT_YEAR}`,
    value: CURRENT_YEAR
  })

  // all time option
  options.push({
    text: `All Time`,
    value: 0
  })

  return options
}

export const getAddressesAndXpubs = createDeepEqualSelector(
  [
    selectors.core.kvStore.eth.getDefaultAddress,
    selectors.core.kvStore.xlm.getDefaultAccountId,
    (state) => state
  ],
  (ethAccountR, xlmAccountR, state) => {
    const transform = (ethAccount, xlmAccount) => {
      // @ts-ignore
      const btcContext: BtcContext = selectors.core.wallet.getContextGrouped(state)
      const bchContext = selectors.core.data.bch.getWalletContext(state)

      return {
        bchAddresses: filter((x: string) => not(startsWith('xpub', x)), bchContext),
        bchXPubs: filter((x: string) => startsWith('xpub', x), bchContext),
        btcBech32ImportedAddresses: btcContext.addresses,
        btcBech32XPubs: btcContext.bech32,
        btcLegacyImportedAddresses: btcContext.addresses,
        btcLegacyXPubs: btcContext.legacy,
        ethAddresses: [ethAccount],
        xlmAddresses: [xlmAccount]
      }
    }

    return lift(transform)(ethAccountR, xlmAccountR)
  }
)
