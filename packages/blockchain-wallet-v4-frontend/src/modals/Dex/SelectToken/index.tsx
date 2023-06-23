import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import type { CoinType } from '@core/types'
import { Modal } from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import { Analytics, DexSwapSide, DexSwapSideFields, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import Header from './Header'
import { useTokenListSearch } from './hooks'
import SearchField from './SearchField'
import SelectTokenList from './SelectTokenList'

const { DEX_SWAP_FORM } = model.components.dex

const COUNTER = 'COUNTER'
const BASE = 'BASE'

type Props = {
  position: number
  swapSide: DexSwapSide
  total: number
}

const DexSelectToken = ({ position, swapSide, total }: Props) => {
  const dispatch = useDispatch()
  const { onSearchChange, search } = useTokenListSearch()

  useEffect(() => {
    if (swapSide === BASE) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_INPUT_OPENED,
          properties: {}
        })
      )
    }

    if (swapSide === COUNTER) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_OUTPUT_OPENED,
          properties: {}
        })
      )
    }
  }, [swapSide])

  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')

  const onClose = () => {
    dispatch(actions.modals.closeModal())
  }

  const onTokenSelect = (token: CoinType) => {
    // track event when counter token is selected
    if (swapSide === COUNTER) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_OUTPUT_SELECTED,
          properties: {
            output_currency: token
          }
        })
      )
    }

    // set selected token
    dispatch(actions.form.change(DEX_SWAP_FORM, DexSwapSideFields[swapSide], token))

    onClose()
  }

  return (
    <Modal
      size='small'
      total={total}
      position={position}
      style={{ height: '480px', padding: '24px', width: '480px' }}
    >
      <Header onClickClose={onClose} />
      <SearchField onChange={onSearchChange} />
      <SelectTokenList
        onTokenSelect={onTokenSelect}
        search={search}
        swapSide={swapSide}
        walletCurrency={walletCurrency}
      />
    </Modal>
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_SELECT))(
  DexSelectToken
)
