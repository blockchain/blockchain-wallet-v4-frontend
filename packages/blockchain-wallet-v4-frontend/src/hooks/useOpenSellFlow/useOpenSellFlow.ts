import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { OrderType } from '@core/types'
import { actions } from 'data'

import { OpenSellFlowHook, OpenSellFlowHookOpenCallback } from './types'

export const useOpenSellFlow: OpenSellFlowHook = () => {
  const dispatch = useDispatch()

  const open: OpenSellFlowHookOpenCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.components.buySell.showModal({
          cryptoCurrency: coin,
          orderType: OrderType.SELL,
          origin
        })
      )
    },
    [dispatch]
  )

  return open
}
