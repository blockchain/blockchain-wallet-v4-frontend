import { utils, Remote, Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'

export const getData = (state, sourceCoin, source, ethFee, depositAmount) => {
  const ethAddressesR = selectors.core.data.ethereum.getAddresses(state)
  const bchSelection = selectors.core.data.bch.getSelection(state)
  const btcSelection = selectors.core.data.bitcoin.getSelection(state)
  const nonce = selectors.core.data.ethereum.getNonce(state, prop('address', source)).getOrElse(undefined)
  const gasPrice = prop('priority', ethFee)
  const gasLimit = prop('gasLimit', ethFee)

  const calculateBchFee = selection => {
    const feeBch = Exchange.convertBchToBch({ value: prop('fee', selection), fromUnit: 'SAT', toUnit: 'BCH' }).value
    return Remote.of(feeBch)
  }

  const calculateBtcFee = selection => {
    const feeBitcoin = Exchange.convertBitcoinToBitcoin({ value: prop('fee', selection), fromUnit: 'SAT', toUnit: 'BTC' }).value
    return Remote.of(feeBitcoin)
  }

  const calculateEthFee = ethAddresses => {
    const transform = ethAddresses => {
      const ethBalance = path([prop('address', source), 'balance'], ethAddresses)
      const data = utils.ethereum.calculateBalanceEther(gasPrice, gasLimit, ethBalance)
      return prop('fee', data)
    }
    return lift(transform)(ethAddresses)
  }

  const feeR = () => {
    switch (sourceCoin) {
      case 'BCH': return calculateBchFee(bchSelection)
      case 'BTC': return calculateBtcFee(btcSelection)
      case 'ETH': return calculateEthFee(ethAddressesR)
      default: return 0
    }
  }

  return lift((fee) => ({
    bchSelection,
    btcSelection,
    gasPrice,
    gasLimit,
    nonce,
    depositFee: fee,
    depositTotal: new BigNumber(depositAmount).add(new BigNumber(fee)).toString()
  }))(feeR())
}
