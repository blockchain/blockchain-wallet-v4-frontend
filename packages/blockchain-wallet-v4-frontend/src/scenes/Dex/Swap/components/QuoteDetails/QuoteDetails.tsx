import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import FiatDisplay from 'components/Display/FiatDisplay'
import { notReachable } from 'utils/notReachable'

import {
  EditSlippageText,
  LoadingBox,
  QuoteWrapper,
  RowDetails,
  RowTitle,
  RowValue,
  ValueSubText,
  ValueText
} from './styled'

type Slippage = { type: 'manual'; value: number } | { type: 'auto' }

const SlippageText = ({ slippage }: { slippage: Slippage }) => {
  switch (slippage.type) {
    case 'auto':
      return <FormattedMessage id='dex.slippage.labelAuto' defaultMessage='Auto' />
    case 'manual':
      return <>`${slippage.value * 100}%`</>
    default:
      return notReachable(slippage)
  }
}

type Props = {
  handleSettingsClick: () => void
  slippage: Slippage
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
  // TODO: use useRemote hook
  /* eslint-disable no-return-assign */
  // import { DexSwapQuoteResponse } from '@core/network/api/dex/types'
  // quoteR.cata({
  //   Failure: () => (isQuoteLoading = true),
  //   Loading: () => (isQuoteLoading = true),
  //   NotAsked: () => (isQuoteLoading = true),
  //   Success: (val) => {
  //     isQuoteLoading = false
  //     return (quote = val as DexSwapQuoteResponse)
  //   }
  // })

  return (
    <QuoteWrapper animate={swapDetailsOpen}>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
        </RowTitle>
        <RowValue>
          <ValueText>
            <SlippageText slippage={slippage} />
          </ValueText>
          <EditSlippageText onClick={handleSettingsClick}>
            <FormattedMessage id='buttons.edit' defaultMessage='Edit' />
          </EditSlippageText>
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.minimum_received' defaultMessage='Minimum Received' />
        </RowTitle>
        <RowValue>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.send_amount' defaultMessage='Send Amount' />
        </RowTitle>
        <RowValue>
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
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
        </RowTitle>
        <RowValue>
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
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.blockchain_fee' defaultMessage='Blockchain.com Fee' />
        </RowTitle>
        <RowValue>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </RowValue>
      </RowDetails>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </RowTitle>
        <RowValue>
          {isQuoteLoading ? (
            <LoadingBox bgColor='white' />
          ) : (
            <>
              <ValueText>?</ValueText>
              <ValueSubText>?</ValueSubText>
            </>
          )}
        </RowValue>
      </RowDetails>
    </QuoteWrapper>
  )
}
