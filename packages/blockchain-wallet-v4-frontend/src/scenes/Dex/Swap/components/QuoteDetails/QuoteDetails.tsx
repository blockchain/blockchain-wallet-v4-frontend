import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'

import { Exchange } from '@core'
import { DexSwapQuoteResponse } from '@core/network/api/dex/types'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { model, selectors } from 'data'
import { DexSwapSettingsForm } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '../../Swap'

const { DEX_SWAP_SETTINGS_FORM } = model.components.dex

const slideInTop = keyframes`
  0% {
    transform: scaleY(0.25);
    transform-origin: 100% 0;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 0;
  }
`

const QuoteWrapper = styled.div<{ animate: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  animation: ${slideInTop} 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 16px;
  > :last-child {
    border-bottom: none;
  }
`
const RowDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const RowTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`
const RowValue = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  align-items: flex-end;
`
const ValueText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`
const ValueSubText = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.grey600};
`
const EditSlippageText = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.blue600};
  &:hover {
    cursor: pointer;
  }
`
const LoadingBox = styled(SkeletonRectangle)`
  height: 39px;
  width: 75px;
`

// TODO: ETH is hardcoded in some spots, should be from current chain data
// TODO: hardcoded for only single-leg swaps
const QuoteDetails = ({
  handleSettingsClick,
  quoteR,
  swapDetailsOpen,
  swapSettingsFormValues,
  walletCurrency
}: Props) => {
  let isQuoteLoading = true
  let quote
  /* eslint-disable no-return-assign */
  quoteR.cata({
    Failure: () => (isQuoteLoading = true),
    Loading: () => (isQuoteLoading = true),
    NotAsked: () => (isQuoteLoading = true),
    Success: (val) => {
      isQuoteLoading = false
      return (quote = val as DexSwapQuoteResponse)
    }
  })

  return (
    <QuoteWrapper animate={swapDetailsOpen}>
      <RowDetails>
        <RowTitle>
          <FormattedMessage id='copy.allowed_slippage' defaultMessage='Allowed Slippage' />
        </RowTitle>
        <RowValue>
          <ValueText>
            {swapSettingsFormValues?.activeSlippage
              ? `${parseFloat(swapSettingsFormValues?.activeSlippage) * 100}%`
              : 'Auto'}
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

const mapStateToProps = (state: RootState) => ({
  swapSettingsFormValues: selectors.form.getFormValues(DEX_SWAP_SETTINGS_FORM)(
    state
  ) as DexSwapSettingsForm
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  handleSettingsClick: () => void
  swapDetailsOpen: boolean
} & Pick<OwnProps, 'quoteR' | 'walletCurrency'>

export default connector(QuoteDetails)
