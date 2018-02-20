import * as crypto from 'crypto'
import { equals, isNil, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

export const initializeForm = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const prevInitialValues = prop('initialValues', prevData)
  const prevCoin = prop('coin', prevData)
  if (!isNil(prevInitialValues) && isNil(prevCoin)) {
    nextProps.formActions.initialize('sendBtc', prevInitialValues)
  }
}

export const switchToEtherOrBchModal = nextProps => {
  const data = nextProps.data.getOrElse({})
  const coin = prop('coin', data)
  if (equals(coin, 'ETH')) {
    nextProps.modalActions.closeAllModals()
    nextProps.modalActions.showModal('SendEth')
  } else if (equals(coin, 'BCH')) {
    nextProps.modalActions.closeAllModals()
    nextProps.modalActions.showModal('SendBch')
  }
}

export const updateUnspent = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevFrom = prop('from', prevData)
  const nextFrom = prop('from', nextData)

  if (!isNil(prevFrom) && !isNil(nextFrom) && !equals(prevFrom, nextFrom)) {
    nextProps.dataBitcoinActions.fetchUnspent(nextFrom.index || nextFrom.address)
  }
}

export const updateEffectiveBalance = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevCoins = prop('coins', prevData)
  const nextCoins = prop('coins', nextData)
  const prevFee = prop('fee', prevData)
  const nextFee = prop('fee', nextData)

  if (!equals(prevCoins, nextCoins) || !equals(prevFee, nextFee)) {
    nextProps.dataBitcoinActions.refreshEffectiveBalance(nextCoins, nextFee)
  }
}

export const updateSelection = (prevProps, nextProps, seed) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevCoins = prop('coins', prevData)
  const nextCoins = prop('coins', nextData)
  const prevFee = prop('fee', prevData)
  const nextFee = prop('fee', nextData)
  const prevAmount = prop('amount', prevData)
  const nextAmount = prop('amount', nextData)
  const prevTo = prop('to', prevData) || prop('to2', prevData)
  const nextTo = prop('to', nextData) || prop('to2', nextData)
  // const nextFrom = prop('from', prevData)
  const nextUnit = prop('unit', nextData)
  const nextChangeAddress = prop('changeAddress', nextData)
  const nextReceiveAddress = prop('receiveAddress', nextData)

  if (!equals(prevCoins, nextCoins) ||
      !equals(prevAmount, nextAmount) ||
      !equals(prevTo, nextTo) ||
      !equals(prevFee, nextFee)) {
    const satoshis = Exchange.convertBitcoinToBitcoin({ value: nextAmount, fromUnit: nextUnit, toUnit: 'SAT' }).value
    const algorithm = 'singleRandomDraw'
    nextProps.dataBitcoinActions.refreshSelection(nextFee, nextCoins, satoshis, nextReceiveAddress, nextChangeAddress, algorithm, seed)
  }
}

export const generateSeed = () => crypto.randomBytes(16).toString('hex')
