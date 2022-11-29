import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@blockchain-com/constellation'

import { actions, model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'
import { ModalName } from 'data/types'

import {
  BaseRateAndFees,
  FlipPairButton,
  FormWrapper,
  QuoteDetails,
  SwapPair,
  SwapPairWrapper
} from '../components'
import { useTokenBalancePreview } from '../hooks'
import { Header } from './Header'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  onClickBack: () => void
  walletCurrency: string
}

export const ConfirmSwap = ({ onClickBack, walletCurrency }: Props) => {
  const dispatch = useDispatch()

  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, counterToken } = formValues || {}

  const baseTokenBalance = useTokenBalancePreview(baseToken)
  const counterTokenBalance = useTokenBalancePreview(counterToken)

  const onViewSettings = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' }))
  }

  const onConfirmSwap = () => null

  return (
    <FormWrapper>
      <Header onClickBack={onClickBack} />

      <SwapPairWrapper>
        <SwapPair
          isQuoteLocked
          swapSide='BASE'
          balance={baseTokenBalance}
          coin={formValues.baseToken}
          amount={formValues.baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide='COUNTER'
          balance={counterTokenBalance}
          coin={formValues.counterToken}
          amount={formValues.counterTokenAmount || 0}
          walletCurrency={walletCurrency}
        />
      </SwapPairWrapper>

      <BaseRateAndFees
        isQuoteLocked
        swapDetailsOpen
        walletCurrency={walletCurrency}
        handleDetailsToggle={() => null} // FIXME: Toggle details
      />

      <QuoteDetails
        swapDetailsOpen
        walletCurrency={walletCurrency}
        slippage={
          formValues.slippage
            ? { type: 'manual', value: parseFloat(formValues.slippage) }
            : { type: 'auto' }
        }
        handleSettingsClick={onViewSettings}
      />

      <Button
        size='large'
        width='full'
        variant='primary'
        onClick={onConfirmSwap}
        text={<FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />}
      />
    </FormWrapper>
  )
}
