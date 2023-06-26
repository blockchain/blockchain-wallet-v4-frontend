import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import {
  Flex,
  IconChevronDown,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import type { BigNumber } from 'bignumber.js'
import { Field } from 'redux-form'

import { Exchange } from '@core'
import { CoinType } from '@core/types'
import { Icon as TokenIcon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions } from 'data'
import { Analytics, DexSwapSide, DexSwapSideFields } from 'data/types'

import { AmountInput, PairWrapper, TokenSelectRow, TokenSelectWrapper } from './styles'
import { getZeroFiatAmountPreview } from './utils'

const BASE = 'BASE'

type Props = {
  swapSide: DexSwapSide
  walletCurrency: string
} & ({ amount: number; balance: number | BigNumber; coin: CoinType } | { coin?: never }) &
  (
    | { hasTriggerAnalytics?: undefined; isQuoteLocked: true; setHasTriggerAnalytics?: undefined }
    | {
        animate: boolean
        hasTriggerAnalytics?: boolean
        isQuoteLocked: false
        onTokenSelect: (swapSide: DexSwapSide) => void
        setHasTriggerAnalytics?: (status: boolean) => void
      }
  )

export const SwapPair = ({
  hasTriggerAnalytics,
  setHasTriggerAnalytics,
  swapSide,
  walletCurrency,
  ...props
}: Props) => {
  const dispatch = useDispatch()
  // TODO: Make type safe mapping between inputs name and form data properties
  const amountInputField = `${DexSwapSideFields[swapSide]}Amount`
  const isAnimationEnabled = !props.isQuoteLocked ? props.animate : false
  const isAmountEntered = !!(props.coin && props.amount !== 0)

  // product only want to record this event once on first input
  useEffect(() => {
    if (!hasTriggerAnalytics && isAmountEntered && swapSide === BASE && setHasTriggerAnalytics) {
      setHasTriggerAnalytics(true)
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_AMOUNT_ENTERED,
          properties: {}
        })
      )
    }
  }, [hasTriggerAnalytics, isAmountEntered, setHasTriggerAnalytics])

  const openTokenSelector = () => !props.isQuoteLocked && props.onTokenSelect(swapSide)

  const { formatMessage } = useIntl()

  return props.coin ? (
    <PairWrapper animate={isAnimationEnabled} swapSide={swapSide}>
      <Flex flexDirection='column' justifyContent={isAmountEntered ? 'space-evenly' : 'center'}>
        <Field
          component={AmountInput}
          data-e2e={`${swapSide}AmountField`}
          disabled={props.isQuoteLocked || swapSide === 'COUNTER'}
          placeholder='0.00'
          name={amountInputField}
          validate={[]}
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
          onClick={openTokenSelector}
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
      <Flex flexDirection='column' justifyContent={isAmountEntered ? 'space-evenly' : 'center'}>
        <Field
          component={AmountInput}
          data-e2e={`${swapSide}AmountField`}
          disabled={props.isQuoteLocked || swapSide === 'COUNTER'}
          placeholder='0.00'
          name={amountInputField}
          validate={[]}
        />
        <Text variant='paragraph-mono' color={SemanticColors.body}>
          {getZeroFiatAmountPreview(walletCurrency)}
        </Text>
      </Flex>
      <Flex justifyContent='space-evenly' alignItems='center'>
        <TokenSelectWrapper
          role='button'
          isQuoteLocked={props.isQuoteLocked}
          onClick={openTokenSelector}
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
