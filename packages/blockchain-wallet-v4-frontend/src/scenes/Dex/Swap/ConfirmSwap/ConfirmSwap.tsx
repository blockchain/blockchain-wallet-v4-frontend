import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button } from '@blockchain-com/constellation'

import { model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'

import { FlipPairButton, FormWrapper, SwapPair, SwapPairWrapper } from '../components'
import { Header } from './Header'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  onClickBack: () => void
  walletCurrency: string
}

export const ConfirmSwap = ({ onClickBack, walletCurrency }: Props) => {
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount } = formValues || {}

  const baseTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(baseToken)
  )
  const counterTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(counterToken)
  )

  const onConfirmSwap = () => null

  return (
    <FormWrapper>
      <Header onClickBack={onClickBack} />

      <SwapPairWrapper>
        <SwapPair
          isQuoteLocked
          swapSide='BASE'
          balance={baseTokenBalance}
          coin={baseToken}
          amount={baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide='COUNTER'
          balance={counterTokenBalance}
          coin={counterToken}
          amount={counterTokenAmount || 0}
          walletCurrency={walletCurrency}
        />
      </SwapPairWrapper>

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
