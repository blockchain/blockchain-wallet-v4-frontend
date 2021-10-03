import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.lockbox.getBtcContextForDevice,
    selectors.core.kvStore.lockbox.getBchContextForDevice,
    selectors.core.kvStore.lockbox.getEthContextForDevice,
    selectors.core.kvStore.lockbox.getXlmContextForDevice
  ],
  (btcR, bchR, ethR, xlmR) => {
    const btc = btcR.getOrElse({})
    const bch = bchR.getOrElse({})
    const eth = ethR.getOrElse([])
    const xlm = xlmR.getOrElse([])

    return Remote.of({
      btc: btc[0],
      bch: bch[0],
      eth: eth[0],
      xlm: xlm[0]
    })
  }
)
