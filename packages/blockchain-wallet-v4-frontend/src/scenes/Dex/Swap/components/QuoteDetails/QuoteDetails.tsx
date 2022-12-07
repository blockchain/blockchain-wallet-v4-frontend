import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import FiatDisplay from 'components/Display/FiatDisplay'

import {
  EditSlippageText,
  LoadingBox,
  QuoteWrapper,
  RowDetails,
  RowTitle,
  ValueSubText,
  ValueText
} from './styles'

type Props = {
  handleSettingsClick: () => void
  slippage: number
  swapDetailsOpen: boolean
  walletCurrency: string
}

// TODO: ETH is hardcoded in some spots, should be from current chain data
// TODO: hardcoded for only single-leg swaps
export const QuoteDetails = ({
  handleSettingsClick,
  slippage,
  swapDetailsOpen,
  walletCurrency
}: Props) => {
  const isQuoteLoading = true
  let quote

  return (
    <QuoteWrapper animate={swapDetailsOpen}>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          <ValueText>{slippage * 100}</ValueText>
          <EditSlippageText onClick={handleSettingsClick}>
            <FormattedMessage id='buttons.edit' defaultMessage='Edit' />
          </EditSlippageText>
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.minimum_received' defaultMessage='Minimum Received' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.send_amount' defaultMessage='Send Amount' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <FiatDisplay
                coin={quote?.quotes[0].sellAmount.symbol}
                currency={walletCurrency}
                color='textBlack'
                lineHeight='150%'
                loadingHeight='14px'
                size='14px'
                weight={600}
              >
                {Exchange.convertCoinToCoin({
                  baseToStandard: false,
                  coin: quote?.quotes[0].sellAmount.symbol,
                  value: Exchange.convertCoinToCoin({
                    coin: quote?.quotes[0].sellAmount.symbol,
                    value: quote?.quotes[0].sellAmount.amount
                  })
                })}
              </FiatDisplay>
              <ValueSubText>
                {Exchange.convertCoinToCoin({
                  coin: quote?.quotes[0].sellAmount.symbol,
                  value: quote?.quotes[0].sellAmount.amount
                })}{' '}
                {quote?.quotes[0].sellAmount.symbol}
              </ValueSubText>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <FiatDisplay
                coin={quote?.quotes[0].sellAmount.symbol}
                currency={walletCurrency}
                color='textBlack'
                lineHeight='150%'
                loadingHeight='14px'
                size='14px'
                weight={600}
              >
                {new BigNumber(quote?.txs[0].gasPrice || 0)
                  .multipliedBy(quote.txs[0].gasLimit || 0)
                  .toString()}
              </FiatDisplay>
              <ValueSubText>
                {Exchange.convertCoinToCoin({
                  coin: 'ETH',
                  value: quote.txs[0].gasPrice * quote.txs[0].gasLimit
                })}
                {' ETH'}
              </ValueSubText>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.blockchain_fee' defaultMessage='Blockchain.com Fee' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </Flex>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </RowTitle>
        <Flex flexDirection='column' alignItems='flex-end' justifyContent='space-between'>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </Flex>
      </RowDetails>
    </QuoteWrapper>
  )
}
