import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Remote } from '@core'
import { actions, selectors } from 'data'
import { getCoinFromPair } from 'data/components/buySell/model'

import { useRemote } from '../useRemote'
import { OpenSellModalCallback, OpenSellModalHook } from './useOpenSellModal.types'

export const useOpenSellModal: OpenSellModalHook = () => {
  const dispatch = useDispatch()
  const ratesRemote = useSelector(selectors.components.buySell.getBSPairs)

  const { data: pairs } = useRemote(selectors.components.buySell.getBSPairs)

  useEffect(() => {
    if (Remote.NotAsked.is(ratesRemote)) {
      dispatch(
        actions.components.buySell.fetchPairs({
          coin: 'BTC',
          currency: 'USD'
        })
      )
    }
  }, [dispatch, ratesRemote])

  const openSellModal: OpenSellModalCallback = useCallback(
    ({ coin, origin }) => {
      if (!pairs) return

      const pair = pairs.find((value) => getCoinFromPair(value.pair) === coin)

      if (!pair) return

      dispatch(
        actions.components.buySell.showModal({
          cryptoCurrency: coin,
          orderType: 'SELL',
          origin
        })
      )
    },
    [dispatch, pairs]
  )

  return openSellModal
}
