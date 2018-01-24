import { selectors } from 'data'
import { join, lift } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export const getData = (state) => {
  const bitcoinBalance = selectors.core.data.bitcoin.getBalance(state)
  const etherBalance = selectors.core.data.ethereum.getBalance(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const settings = selectors.core.settings.getSettings(state)

  const transform = (bitcoinBalance, etherBalance, bitcoinRates, ethereumRates, settings) => {
    const bitcoinFiatBalance = Exchange.convertBitcoinToFiat({ value: bitcoinBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bitcoinRates })
    const etherFiatBalance = Exchange.convertEtherToFiat({ value: etherBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethereumRates })
    const totalFiatBalance = Number(bitcoinFiatBalance.value) + Number(etherFiatBalance.value)
    const { symbol } = bitcoinFiatBalance.unit

    // console.log(bitcoinBalance)

    // const bitcoinContext = Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))
    // const etherContext = selectors.core.kvStore.ethereum.getContext(state)
    return ({ bitcoinBalance, etherBalance, bitcoinFiatBalance, etherFiatBalance, totalFiatBalance, symbol })
  }
  return lift(transform)(bitcoinBalance, etherBalance, bitcoinRates, ethereumRates, settings)
}

export const getBitcoinContext = (state) => Remote.of(join('|', selectors.core.wallet.getWalletContext(state)))

export const getEthereumContext = selectors.core.kvStore.ethereum.getContext
