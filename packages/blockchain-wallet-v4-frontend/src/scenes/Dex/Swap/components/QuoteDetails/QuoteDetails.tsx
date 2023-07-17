import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import { Image, SkeletonRectangle, TooltipHost } from 'blockchain-info-components'
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
          <TooltipHost id='tooltip.dex.slippage'>
            <Image name='circle-question' size='14px' />
          </TooltipHost>
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
          <TooltipHost id='tooltip.dex.minimum_amount'>
            <Image name='circle-question' size='14px' />
          </TooltipHost>
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {props.isQuoteLoading ? (
            <SkeletonRectangle bgColor='white' height='39px' width='75px' />
          ) : (
            <>
              <Text color={SemanticColors.title} variant='paragraph2'>
                {Exchange.convertCoinToCoin({
                  coin: props.swapQuote.quote.buyAmount.symbol,
                  value:
                    props.swapQuote.quote.buyAmount?.minAmount ||
                    props.swapQuote.quote.buyAmount.amount
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
                    value:
                      props.swapQuote.quote.buyAmount?.minAmount ||
                      props.swapQuote.quote.buyAmount.amount
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
          <TooltipHost id='tooltip.dex.network_fee'>
            <Image name='circle-question' size='14px' />
          </TooltipHost>
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
                  coin='ETH'
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
          <TooltipHost id='tooltip.dex.blockchain_fee'>
            <Image name='circle-question' size='14px' />
          </TooltipHost>
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {props.isQuoteLoading ? (
            <SkeletonRectangle bgColor='white' height='39px' width='75px' />
          ) : (
            <>
              <Text color={SemanticColors.title} variant='paragraph2'>
                ~
                {Exchange.convertCoinToCoin({
                  coin: props.swapQuote.quote.buyAmount.symbol,
                  value: (props.swapQuote.quote.buyAmount.amount / 100) * 0.9
                })}{' '}
                {props.swapQuote.quote.buyAmount.symbol}
              </Text>
              <Flex>
                ~
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
                      value: (props.swapQuote.quote.buyAmount.amount / 100) * 0.9
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
