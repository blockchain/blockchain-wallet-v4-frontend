import {
  AmountHeader,
  Wrapper as BorderWrapper,
  ExchangeAmount,
  ExchangeAmounts,
  LargeTableRow,
  SubExchangeAmount
} from 'components/Exchange'
import { BigNumber } from 'bignumber.js'
import { coinToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formatAmount } from '../services'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { TooltipHost, TooltipIcon } from 'blockchain-info-components'
import React from 'react'
import StringDisplay from 'components/Display/StringDisplay'
import styled from 'styled-components'
import TargetFiatAmount from './TargetFiatAmount'

const SummaryWrapper = styled(BorderWrapper)`
  padding: 0;
  width: 100%;
  margin-bottom: 20px;
`
const SummaryExchangeAmount = styled(ExchangeAmount)`
  justify-content: flex-end;
`
const TooltipWrapAmountHeader = styled(AmountHeader)`
  display: flex;
`
const SummaryStringDisplay = styled(StringDisplay)`
  justify-content: flex-end;
`

const add = (augend, addend) => new BigNumber.sum(augend, addend).toString()

export class Summary extends React.PureComponent {
  render () {
    const {
      currency,
      insufficientEthBalance,
      sourceAmount,
      sourceCoinTicker,
      sourceFee,
      sourceFiat,
      sourceFeeFiat,
      targetAmount,
      targetCoin,
      targetCoinTicker
    } = this.props

    const fiatCurrencySymbol = Exchange.getSymbol(currency)

    return (
      <SummaryWrapper>
        <LargeTableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.exchange'
              defaultMessage='Exchange'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <SummaryExchangeAmount color='grey700'>
              <SummaryStringDisplay
                data-e2e='exchangeSummarySwapFiatValue'
                skeletonHeight='20px'
                skeletonWidth='46px'
              >
                {sourceFiat.map(amount =>
                  formatAmount(true, fiatCurrencySymbol, amount)
                )}
              </SummaryStringDisplay>
            </SummaryExchangeAmount>
            <SubExchangeAmount color='grey700'>
              <SummaryStringDisplay data-e2e='exchangeSummarySwapValue'>
                {sourceAmount.map(amount =>
                  coinToString({
                    value: amount,
                    unit: { symbol: sourceCoinTicker },
                    minDigits: 2
                  })
                )}
              </SummaryStringDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <TooltipWrapAmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.networkfees'
              defaultMessage='Network Fees'
            />
            <TooltipHost id='exchange.networkfees'>
              <TooltipIcon
                name='question-in-circle-filled'
                color='grey400'
                size='18px'
              />
            </TooltipHost>
          </TooltipWrapAmountHeader>
          <ExchangeAmounts>
            <SummaryExchangeAmount
              color={insufficientEthBalance ? 'error' : 'grey700'}
              data-e2e='exchangeSummaryFeeFiatValue'
            >
              {formatAmount(true, fiatCurrencySymbol, sourceFeeFiat)}
            </SummaryExchangeAmount>
            <SubExchangeAmount
              color={insufficientEthBalance ? 'error' : 'grey700'}
              data-e2e='exchangeSummaryFeeValue'
            >
              {coinToString({
                value: sourceFee.source,
                unit: {
                  symbol: sourceFee.isSourceErc20 ? 'ETH' : sourceCoinTicker
                },
                minDigits: 2
              })}
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.send'
              defaultMessage='Send'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <SummaryExchangeAmount color='grey700'>
              -
              <SummaryStringDisplay
                data-e2e='exchangeSummaryTotalFiatValue'
                skeletonHeight='20px'
                skeletonWidth='46px'
              >
                {sourceFiat.map(amount =>
                  formatAmount(
                    true,
                    fiatCurrencySymbol,
                    add(amount, sourceFeeFiat)
                  )
                )}
              </SummaryStringDisplay>
            </SummaryExchangeAmount>
            <SubExchangeAmount color='grey700'>
              <span>-</span>
              <SummaryStringDisplay data-e2e='exchangeSummaryTotalValue'>
                {sourceAmount.map(amount =>
                  coinToString({
                    value: sourceFee.isSourceErc20
                      ? amount
                      : add(amount, sourceFee.source),
                    unit: { symbol: sourceCoinTicker },
                    minDigits: 2
                  })
                )}
              </SummaryStringDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <AmountHeader color='blue900' weight={500}>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.to'
              defaultMessage='Receive'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <SummaryExchangeAmount>
              <TargetFiatAmount
                targetAmount={targetAmount}
                targetCoin={targetCoin}
                color='blue900'
                weight={500}
              />
            </SummaryExchangeAmount>
            <SubExchangeAmount color='grey700'>
              <SummaryStringDisplay data-e2e='exchangeSummaryTargetValue'>
                {targetAmount.map(amount =>
                  coinToString({
                    value: amount,
                    unit: { symbol: targetCoinTicker },
                    minDigits: 2
                  })
                )}
              </SummaryStringDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
      </SummaryWrapper>
    )
  }
}

export default connect(getData)(Summary)
