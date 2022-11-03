import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSPairType } from '@core/types'
import { actions, selectors } from 'data'
import { useRemote } from 'hooks'

import Success from '../AddCardCheckoutDotCom/template.success'
import { getData } from './selectors'
import { VgsComponent } from './types'

const AddCardVgs: VgsComponent = ({ handleClose, origin }) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLIFrameElement>(null)
  const walletHelper = useSelector(getData)
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const { cardTokenId, vgsVaultId } = useSelector(selectors.components.buySell.getVgsAddCardInfo)

  if (!data) return null

  return (
    <Success
      pair={data.pair || (`${data.fiatCurrency}-${data.cryptoCurrency}` as unknown as BSPairType)}
      handleClose={handleClose}
      cryptoCurrency={data.cryptoCurrency}
      fiatCurrency={data.fiatCurrency}
      buySellActions={bindActionCreators(actions.components.buySell, dispatch)}
      domain={`${walletHelper}/wallet-helper/vgs/#/add-card/${vgsVaultId}/staging`}
      iframeRef={ref}
    />
  )
}

export default AddCardVgs
