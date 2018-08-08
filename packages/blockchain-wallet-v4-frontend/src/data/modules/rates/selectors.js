import { compose, curry, keysIn, path, pickBy, last, lift } from 'ramda'
import BigNumber from 'bignumber.js'

import { Remote } from 'blockchain-wallet-v4'

const isActive = ({ refs }) => refs > 0

export const getActivePairs = compose(
  keysIn,
  pickBy(isActive),
  path(['rates', 'pairs'])
)

const quoteToRate = (quote, volume) => {
  let totalPrice = new BigNumber(0)
  let remainingVolume = new BigNumber(volume)
  for (let askTier of quote.askTiers) {
    const tierVolume = new BigNumber(askTier.volume)
    const { price } = askTier
    if (remainingVolume.lessThan(tierVolume)) {
      totalPrice = totalPrice.plus(remainingVolume.times(price))
      remainingVolume = new BigNumber(0)
      break
    }

    totalPrice = totalPrice.plus(tierVolume.times(price))
    remainingVolume = remainingVolume.minus(tierVolume)
  }

  if (remainingVolume.greaterThan(0)) {
    totalPrice = totalPrice.plus(
      remainingVolume.times(last(quote.askTiers).price)
    )
  }

  return totalPrice.dividedBy(volume)
}

export const getPairRate = curry((pair, volume, state) =>
  lift(quoteToRate)(
    path(['rates', 'pairs', pair, 'quote'], state),
    Remote.of(volume)
  )
)

export const getAvailablePairs = path(['rates', 'availablePairs'])
