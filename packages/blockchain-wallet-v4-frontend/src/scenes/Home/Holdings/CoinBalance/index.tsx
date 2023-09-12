import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { bch, btc, coins, eth, fiat, misc, stx, xlm } from '@core/redux/data/actions'
import { SkeletonRectangle } from 'blockchain-info-components'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'

const cryptoActions = {
  bchActions: bch,
  btcActions: btc,
  coinActions: coins,
  ethActions: eth,
  fiatActions: fiat,
  miscActions: misc,
  stxActions: stx,
  xlmAction: xlm
}

const CoinBalance = ({ coin }: { coin: string }) => {
  const data = useSelector((state: RootState) => getData(state, coin))

  const dispatch = useDispatch()

  const handleRefresh = (e?: KeyboardEvent) => {
    if (e) {
      e.preventDefault()
    }
    const { coinfig } = window.coins[coin]
    if (selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin)) {
      dispatch(cryptoActions.coinActions.fetchData('', [coin]))
    } else if (coinfig.type.erc20Address) {
      dispatch(cryptoActions.ethActions.fetchErc20Data(coin))
    } else {
      const coinLower = coin.toLocaleLowerCase()
      dispatch(cryptoActions[`${coinLower}Actions`].fetchData())
    }
  }

  return data.cata({
    Failure: () => <Error coin={coin} onRefresh={(e) => handleRefresh(e)} />,
    Loading: () => <SkeletonRectangle height='35px' width='60px' />,
    NotAsked: () => <SkeletonRectangle height='35px' width='60px' />,
    Success: (value) => <Success balance={value} coin={coin} />
  })
}

export default memo(CoinBalance)
