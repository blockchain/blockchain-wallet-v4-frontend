import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import { SkeletonRectangle } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import { EditSlippageText, QuoteWrapper, RowDetails, RowTitle, ValueText } from './styles'
import { QuoteDetailsProps } from './types'

// TODO: ETH is hardcoded in some spots, should be from current chain data
// TODO: hardcoded for only single-leg swaps
export const QuoteDetails = ({
  handleSettingsClick,
  isDetailsOpen,
  slippage,
  walletCurrency,
  ...props
}: QuoteDetailsProps) => {
  return (
    <QuoteWrapper animate={isDetailsOpen}>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          <ValueText>{slippage * 100}%</ValueText>
          {handleSettingsClick && (
            <EditSlippageText onClick={handleSettingsClick}>
              <FormattedMessage id='buttons.edit' defaultMessage='Edit' />
            </EditSlippageText>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.minimum_amount' defaultMessage='Minimum Amount' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {props.isQuoteLoading ? (
            <SkeletonRectangle bgColor='white' height='39px' width='75px' />
          ) : (
            <>
              <Text color={SemanticColors.title} variant='paragraph2'>
                {Exchange.convertCoinToCoin({
                  coin: props.swapQuote.quote.buyAmount.symbol,
                  value: props.swapQuote.quote.buyAmount.minAmount
                })}{' '}
                {props.swapQuote.quote.buyAmount.symbol}
              </Text>
              <FiatDisplay
                coin={props.swapQuote.quote.buyAmount.symbol}
                currency={walletCurrency}
                color='grey700'
                lineHeight='150%'
                loadingHeight='14px'
                size='12px'
                weight={500}
              >
                {Exchange.convertCoinToCoin({
                  baseToStandard: false,
                  coin: props.swapQuote.quote.buyAmount.symbol,
                  value: Exchange.convertCoinToCoin({
                    coin: props.swapQuote.quote.buyAmount.symbol,
                    value: props.swapQuote.quote.buyAmount.minAmount
                  })
                })}
              </FiatDisplay>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {props.isQuoteLoading ? (
            <SkeletonRectangle bgColor='white' height='39px' width='75px' />
          ) : (
            <>
              <Text color={SemanticColors.title} variant='paragraph2'>
                ~
                {Exchange.convertCoinToCoin({
                  coin: 'ETH',
                  value:
                    Number(props.swapQuote.transaction.gasPrice) *
                    Number(props.swapQuote.transaction.gasLimit)
                })}
                {' ETH'}
              </Text>
              <Flex>
                ~
                <FiatDisplay
                  coin={props.swapQuote.quote.sellAmount.symbol}
                  currency={walletCurrency}
                  color='grey700'
                  lineHeight='150%'
                  loadingHeight='14px'
                  size='12px'
                  weight={500}
                >
                  {new BigNumber(props.swapQuote.transaction.gasPrice)
                    .multipliedBy(props.swapQuote.transaction.gasLimit)
                    .toString()}
                </FiatDisplay>
              </Flex>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.blockchain_fee' defaultMessage='Blockchain.com Fee' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {props.isQuoteLoading ? (
            <SkeletonRectangle bgColor='white' height='39px' width='75px' />
          ) : (
            <>
              <Text color={SemanticColors.title} variant='paragraph2'>
                ~
                {Exchange.convertCoinToCoin({
                  coin: props.swapQuote.quote.sellAmount.symbol,
                  value: (props.swapQuote.quote.sellAmount.amount / 100) * 0.9
                })}{' '}
                {props.swapQuote.quote.sellAmount.symbol}
              </Text>
              <Flex>
                ~
                <FiatDisplay
                  coin={props.swapQuote.quote.sellAmount.symbol}
                  currency={walletCurrency}
                  color='grey700'
                  lineHeight='150%'
                  loadingHeight='14px'
                  size='12px'
                  weight={500}
                >
                  {Exchange.convertCoinToCoin({
                    baseToStandard: false,
                    coin: props.swapQuote.quote.sellAmount.symbol,
                    value: Exchange.convertCoinToCoin({
                      coin: props.swapQuote.quote.sellAmount.symbol,
                      value: (props.swapQuote.quote.sellAmount.amount / 100) * 0.9
                    })
                  })}
                </FiatDisplay>
              </Flex>
            </>
          )}
        </Flex>
      </RowDetails>
    </QuoteWrapper>
  )
}
