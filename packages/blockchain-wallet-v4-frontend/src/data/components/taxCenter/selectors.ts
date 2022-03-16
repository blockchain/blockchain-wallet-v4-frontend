import { Types } from '@core'
import { model, selectors } from 'data'

import { getData as getDataBch } from '../../../scenes/Settings/Addresses/Bch/Wallets/selectors'
import { getData as getDataXlm } from '../../../scenes/Settings/Addresses/Xlm/selectors'

const BECH32_DERIVATION = 'bech32'
const LEGACY_DERIVATION = 'legacy'
const WALLET = '0'

const { FIRST_YEAR } = model.components.taxCenter

export const selectReports = (state) => state.components.taxCenter.reports

export const selectOptions = () => {
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

const getAddresses = ({ data }) => data.map(({ addr }) => addr)

const getBchAddresses = ({ data }) => data.wallets.map(({ value }) => value.xpub)

export const selectAddress = (state) => {
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(WALLET)
  const ethAddresses = selectors.core.kvStore.eth.getLegacyAccountAddress(state).getOrElse('')
  return {
    bchAddresses: getAddresses(selectors.core.common.bch.getActiveAddresses(state)),
    bchXpubs: getBchAddresses(getDataBch(state)),
    btcBech32ImportedAddresses: getAddresses(selectors.core.common.btc.getActiveAddresses(state)),
    btcBech32XPubs: [Types.HDAccount.selectXpub(account, BECH32_DERIVATION)],
    btcLegacyImportedAddresses: getAddresses(selectors.core.common.btc.getActiveAddresses(state)),
    btcLegacyXPubs: [Types.HDAccount.selectXpub(account, LEGACY_DERIVATION)],
    ethAddresses: ethAddresses ? [ethAddresses] : [],
    xlmAddresses: [getDataXlm(state)?.addressInfo?.addr]
  }
}

export const selectErrors = (state) => ({
  createReport: state.components.taxCenter.createReportError,
  reportList: state.components.taxCenter.fetchError
})
