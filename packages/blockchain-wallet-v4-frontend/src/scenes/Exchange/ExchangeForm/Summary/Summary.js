import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import { Exchange } from 'blockchain-wallet-v4/src'
import { coinToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { formatAmount } from '../services'
import { getData } from './selectors'
import {
  AmountHeader,
  ExchangeAmount,
  ExchangeAmounts,
  SubExchangeAmount,
  TableRow
} from 'components/Exchange'
import StringDisplay from 'components/Display/StringDisplay'

const add = (augend, addend) => new BigNumber.sum(augend, addend).toString()

const SummaryStringDisplay = styled(StringDisplay)`
  justify-content: flex-end;
`

export class Summary extends React.PureComponent {
  render () {
    const {
      currency,
      sourceAmount,
      sourceCoin,
      sourceFee,
      sourceFiat,
      sourceFeeFiat,
      targetAmount,
      targetCoin,
      targetFiat
    } = this.props

    const fiatCurrencySymbol = Exchange.getSymbol(currency)

    return (
      <React.Fragment>
        <TableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.exchange'
              defaultMessage='Exchange'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <ExchangeAmount color='gray-5'>
              <SummaryStringDisplay data-e2e='exchangeSummarySwapFiatValue'>
                {sourceFiat.map(amount =>
                  formatAmount(true, fiatCurrencySymbol, amount)
                )}
              </SummaryStringDisplay>
            </ExchangeAmount>
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
        </TableRow>
        <TableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.fees'
              defaultMessage='Fees'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <ExchangeAmount
              color='gray-5'
              data-e2e='exchangeSummaryFeeFiatValue'
            >
              {formatAmount(true, fiatCurrencySymbol, sourceFeeFiat)}
            </ExchangeAmount>
            <SubExchangeAmount
              color='gray-5'
              data-e2e='exchangeSummaryFeeValue'
            >
              {coinToString({
                value: sourceFee.source,
                unit: { symbol: sourceCoin },
                minDigits: 2
              })}
            </SubExchangeAmount>
          </ExchangeAmounts>
        </TableRow>
        <TableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.send'
              defaultMessage='Send'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <ExchangeAmount color='gray-5'>
              -
              <SummaryStringDisplay data-e2e='exchangeSummaryTotalFiatValue'>
                {sourceFiat.map(amount =>
                  formatAmount(
                    true,
                    fiatCurrencySymbol,
                    add(amount, sourceFeeFiat)
                  )
                )}
              </SummaryStringDisplay>
            </ExchangeAmount>
            <SubExchangeAmount color='gray-5'>
              -
              <SummaryStringDisplay data-e2e='exchangeSummaryTotalValue'>
                {sourceAmount.map(amount =>
                  coinToString({
                    value: add(amount, sourceFee.source),
                    unit: { symbol: sourceCoin },
                    minDigits: 2
                  })
                )}
              </SummaryStringDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </TableRow>
        <TableRow>
          <AmountHeader color='brand-primary' weight={500}>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.to'
              defaultMessage='Receive'
            />
          </AmountHeader>
          <ExchangeAmounts>
            <ExchangeAmount>
              <SummaryStringDisplay data-e2e='exchangeSummaryTargetFiatValue'>
                {targetFiat.map(amount =>
                  formatAmount(true, fiatCurrencySymbol, amount)
                )}
              </SummaryStringDisplay>
            </ExchangeAmount>
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
        </TableRow>
      </React.Fragment>
    )
  }
}

export default connect(getData)(Summary)
