import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

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
  const isQuoteLoading = false
  const { data: swapQuoteResponse } = useRemote(selectors.components.dex.getSwapQuote)

  const quote = swapQuoteResponse ? (swapQuoteResponse as any)?.quotes_?.[0] : null
  const txLeg = (swapQuoteResponse as any)?.txs_?.[0] || {}

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
                coin={quote?.sellAmount_.symbol_}
                currency={walletCurrency}
                color='textBlack'
                lineHeight='150%'
                loadingHeight='14px'
                size='14px'
                weight={600}
              >
                {Exchange.convertCoinToCoin({
                  baseToStandard: false,
                  coin: quote?.sellAmount_.symbol_,
                  value: Exchange.convertCoinToCoin({
                    coin: quote?.sellAmount_.symbol_,
                    value: quote?.sellAmount_.amount_
                  })
                })}
              </FiatDisplay>
              <ValueSubText>
                {Exchange.convertCoinToCoin({
                  coin: quote?.sellAmount_.symbol_,
                  value: quote?.sellAmount_.amount_
                })}{' '}
                {quote?.sellAmount_.symbol_}
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
                coin={quote?.sellAmount_.symbol_}
                currency={walletCurrency}
                color='textBlack'
                lineHeight='150%'
                loadingHeight='14px'
                size='14px'
                weight={600}
              >
                {new BigNumber(txLeg?.gasPrice_ || 0)
                  .multipliedBy(txLeg?.gasPrice_ || 0)
                  .toString()}
              </FiatDisplay>
              <ValueSubText>
                {Exchange.convertCoinToCoin({
                  coin: 'ETH',
                  value: txLeg?.gasPrice_ * txLeg?.gasPrice_
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
