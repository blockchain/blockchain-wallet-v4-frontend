import { utils, Remote, Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { equals, lift, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'

export const getData = (state, sourceCoin, source, ethFee, depositAmount) => {
  const ethAddressesR = selectors.core.data.ethereum.getAddresses(state)
  const selection = selectors.core.data.bitcoin.getSelection(state)

  const calculateBtcFee = selection => {
    const feeBitcoin = Exchange.convertBitcoinToBitcoin({ value: prop('fee', selection), fromUnit: 'SAT', toUnit: 'BTC' }).value
    return Remote.of(feeBitcoin)
  }

  const calculateEthFee = ethAddresses => {
    const transform = ethAddresses => {
      const ethBalance = path([prop('address', source), 'balance'], ethAddresses)
      const data = utils.ethereum.calculateBalanceEther(ethFee.priority, ethFee.gasLimit, ethBalance)
      return prop('fee', data)
    }
    return lift(transform)(ethAddresses)
  }

  const feeR = equals('BTC', sourceCoin) ? calculateBtcFee(selection) : calculateEthFee(ethAddressesR)

  const transform = (fee) => ({
    depositFee: fee,
    depositTotal: new BigNumber(depositAmount).add(new BigNumber(fee)).toString()
  })

  const result = lift(transform)(feeR)
  console.log('result', result)
  return result
}
