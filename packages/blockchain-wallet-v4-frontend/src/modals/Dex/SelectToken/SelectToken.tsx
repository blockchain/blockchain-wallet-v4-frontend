import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import type { CoinType } from '@core/types'
import { Modal } from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSide, DexSwapSideFields, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'
import { notReachable } from 'utils/helpers'

import { Header, SearchField, TokenList } from './components'
import { useTokensListData, useTokensListScroll, useTokensListSearch } from './hooks'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  position: number
  swapSide: DexSwapSide
  total: number
}

const DexSelectToken = ({ position, swapSide, total }: Props) => {
  const dispatch = useDispatch()

  const swapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')

  const tokensListState = useTokensListData()

  const { onSearchChange, search } = useTokensListSearch({
    onSearch: (s) =>
      dispatch(actions.components.dex.fetchChainTokens({ search: s, type: 'RELOAD' }))
  })

  const { onScroll, ref: scrollableRef } = useTokensListScroll({
    isActive: tokensListState.type === 'LOADED',
    onScrollEnd: () => {
      switch (tokensListState.type) {
        case 'ERROR':
        case 'IS_EMPTY':
        case 'LOADING':
        case 'LOADING_MORE':
        case 'NO_MORE_TOKENS':
          break
        case 'LOADED':
          dispatch(
            actions.components.dex.fetchChainTokens({ search: search || '', type: 'LOAD_MORE' })
          )
          break
        default:
          notReachable(tokensListState)
      }
    }
  })

  const onClose = () => {
    dispatch(actions.modals.closeModal())
  }

  const onTokenSelect = (token: CoinType) => {
    // set selected token
    dispatch(actions.form.change(DEX_SWAP_FORM, DexSwapSideFields[swapSide], token))

    // if same token would now be on both sides of swap, clear other side of swap
    const oppositeSide = swapSide === 'BASE' ? 'COUNTER' : 'BASE'
    if (swapFormValues[DexSwapSideFields[oppositeSide]] === token) {
      dispatch(actions.form.change(DEX_SWAP_FORM, DexSwapSideFields[oppositeSide], undefined))
    }

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

      {(() => {
        switch (tokensListState.type) {
          case 'LOADING':
            return <TokenList.Loading />
          case 'IS_EMPTY':
            return <TokenList.Empty search={search || ''} />
          case 'ERROR':
            return <TokenList.Failed />
          case 'LOADED':
          case 'NO_MORE_TOKENS':
            return (
              <TokenList
                ref={scrollableRef}
                walletCurrency={walletCurrency}
                data={tokensListState.data || []}
                onTokenSelect={onTokenSelect}
                onScroll={() => onScroll()}
              />
            )
          case 'LOADING_MORE':
            return (
              <TokenList
                ref={scrollableRef}
                walletCurrency={walletCurrency}
                data={tokensListState.data || []}
                onTokenSelect={onTokenSelect}
                onScroll={() => onScroll()}
              >
                <TokenList.LoadingMore />
              </TokenList>
            )
          default:
            notReachable(tokensListState)
        }
      })()}
    </Modal>
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_SELECT))(
  DexSelectToken
)
