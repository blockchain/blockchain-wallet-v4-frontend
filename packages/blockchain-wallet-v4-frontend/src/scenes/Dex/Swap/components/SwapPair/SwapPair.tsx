import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Flex,
  IconChevronDown,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { Field } from 'redux-form'

import { Exchange } from '@core'
import { CoinType } from '@core/types'
import { Icon as TokenIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import type { DexSwapSide } from 'data/types'

import { AmountInput, PairWrapper, TokenSelectRow, TokenSelectWrapper } from './styled'

type Props = {
  swapSide: DexSwapSide
  walletCurrency: string
} & ({ amount: number; balance: number; coin: CoinType } | { coin?: never }) &
  (
    | { isQuoteLocked: true }
    | {
        animate: boolean
        isQuoteLocked: false
        onTokenSelect: (swapSide: DexSwapSide) => void
      }
  )

export const SwapPair = ({ swapSide, walletCurrency, ...props }: Props) => {
  const amountInputField = `${swapSide}Amount`
  const isAnimationEnabled = !props.isQuoteLocked ? props.animate : false
  const isAmountEntered = !!(props.coin && props.amount !== 0)

  const { formatMessage } = useIntl()

  return props.coin ? (
    <PairWrapper animate={isAnimationEnabled} swapSide={swapSide}>
      <Flex flexDirection='column' justifyContent={isAmountEntered ? 'space-evenly' : 'center'}>
        <Field
          component={AmountInput}
          data-e2e={`${swapSide}AmountField`}
          disabled={props.isQuoteLocked}
          placeholder='0.00'
          name={amountInputField}
          validate={[]} // FIXME: Validate
        />
        <FiatDisplay
          coin={props.coin}
          currency={walletCurrency}
          color='grey600'
          lineHeight='12px'
          loadingHeight='14px'
          size='14px'
          weight={500}
        >
          {Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: props.coin,
            value: props.amount
          })}
        </FiatDisplay>
      </Flex>
      <Flex flexDirection='column' justifyContent='space-evenly' alignItems='center'>
        <TokenSelectWrapper
          role='button'
          isQuoteLocked={props.isQuoteLocked}
          onClick={() => !props.isQuoteLocked && props.onTokenSelect(swapSide)}
        >
          <Padding right={0.5}>
            <TokenIcon name={props.coin} size='16px' />
          </Padding>
          <TokenSelectRow>
            <Text variant='caption2' color={SemanticColors.body}>
              {props.coin}
            </Text>
            <IconChevronDown
              size='small'
              color={PaletteColors['grey-400']}
              label={formatMessage({
                defaultMessage: 'Select coin to swap',
                id: 'dex.swapCoin.label'
              })}
            />
          </TokenSelectRow>
        </TokenSelectWrapper>
        <CoinDisplay coin={props.coin} color='grey600' size='10px' weight={500}>
          {props.balance}
        </CoinDisplay>
      </Flex>
    </PairWrapper>
  ) : (
    <PairWrapper animate={isAnimationEnabled} swapSide={swapSide}>
      <Field
        component={AmountInput}
        data-e2e={`${swapSide}AmountField`}
        disabled={props.isQuoteLocked}
        placeholder='0.00'
        name={amountInputField}
        validate={[]}
      />
      <Flex justifyContent='space-evenly' alignItems='center'>
        <TokenSelectWrapper
          role='button'
          isQuoteLocked={props.isQuoteLocked}
          onClick={() => !props.isQuoteLocked && props.onTokenSelect(swapSide)}
        >
          <TokenSelectRow>
            <Text variant='caption2' color={SemanticColors.body}>
              <FormattedMessage id='buttons.select' defaultMessage='Select' />
            </Text>
            <IconChevronDown
              size='small'
              color={PaletteColors['grey-400']}
              label={formatMessage({
                defaultMessage: 'Select coin to swap',
                id: 'dex.swapCoin.label'
              })}
            />
          </TokenSelectRow>
        </TokenSelectWrapper>
      </Flex>
    </PairWrapper>
  )
}
