import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button } from '@blockchain-com/constellation'

import { actions } from 'data'
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
import { Header } from './Header'

type Props = {
  formValues: DexSwapForm
  onClickBack: () => void
  walletCurrency: string
}

export const ConfirmSwap = ({ formValues, onClickBack, walletCurrency }: Props) => {
  const dispatch = useDispatch()

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
          balance={0} // FIXME: Pass balance
          coin={formValues.baseToken}
          amount={formValues.baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide='COUNTER'
          balance={0} // FIXME: Pass balance
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
        slippage={{ type: 'auto' }} // FIXME: Pass slippage from settings form
        handleSettingsClick={onViewSettings}
      />

      <Button
        size='large'
        width='full'
        variant='primary'
        onClick={onConfirmSwap} // FIXME: Pass slippage from settings form
        text={<FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />}
      />
    </FormWrapper>
  )
}
