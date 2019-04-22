import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import { TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import { coinToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { formatAmount } from '../services'
import { getData } from './selectors'
import {
  AmountHeader,
  ExchangeAmount,
  ExchangeAmounts,
  SubExchangeAmount,
  LargeTableRow,
  Wrapper as BorderWrapper
} from 'components/Exchange'
import StringDisplay from 'components/Display/StringDisplay'
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

const sufficientEthForSwap = (EthBalanceInWei, txFeeInEth) => {
  let ethBalance = Exchange.convertEtherToEther({
    value: EthBalanceInWei,
    fromUnit: 'WEI',
    toUnit: 'ETH'
  }).value
  return ethBalance >= txFeeInEth
}

export class Summary extends React.PureComponent {
  render () {
    const {
      currency,
      EthBalanceInWei,
      sourceAmount,
      sourceCoin,
      sourceFee,
      sourceFiat,
      sourceFeeFiat,
      targetAmount,
      targetCoin
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
            <SummaryExchangeAmount color='gray-5'>
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
            <SubExchangeAmount color='gray-5'>
              <SummaryStringDisplay data-e2e='exchangeSummarySwapValue'>
                {sourceAmount.map(amount =>
                  coinToString({
                    value: amount,
                    unit: { symbol: sourceCoin },
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
                color='lightblue-gray'
                size='18px'
              />
            </TooltipHost>
          </TooltipWrapAmountHeader>
          <ExchangeAmounts>
            <SummaryExchangeAmount
              color={
                sourceFee.isSourceErc20 &&
                !sufficientEthForSwap(EthBalanceInWei, sourceFee.source)
                  ? 'error'
                  : 'gray-5'
              }
              data-e2e='exchangeSummaryFeeFiatValue'
            >
              {formatAmount(true, fiatCurrencySymbol, sourceFeeFiat)}
            </SummaryExchangeAmount>
            <SubExchangeAmount
              color={
                sourceFee.isSourceErc20 &&
                !sufficientEthForSwap(EthBalanceInWei, sourceFee.source)
                  ? 'error'
                  : 'gray-5'
              }
              data-e2e='exchangeSummaryFeeValue'
            >
              {coinToString({
                value: sourceFee.source,
                unit: { symbol: sourceFee.isSourceErc20 ? 'ETH' : sourceCoin },
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
            <SummaryExchangeAmount color='gray-5'>
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
            <SubExchangeAmount color='gray-5'>
              <span>-</span>
              <SummaryStringDisplay data-e2e='exchangeSummaryTotalValue'>
                {sourceAmount.map(amount =>
                  coinToString({
                    value: sourceFee.isSourceErc20
                      ? amount
                      : add(amount, sourceFee.source),
                    unit: { symbol: sourceCoin },
                    minDigits: 2
                  })
                )}
              </SummaryStringDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <AmountHeader color='brand-primary' weight={500}>
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
                color='brand-primary'
                weight={400}
              />
            </SummaryExchangeAmount>
            <SubExchangeAmount color='gray-5'>
              <SummaryStringDisplay data-e2e='exchangeSummaryTargetValue'>
                {targetAmount.map(amount =>
                  coinToString({
                    value: amount,
                    unit: { symbol: targetCoin },
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
