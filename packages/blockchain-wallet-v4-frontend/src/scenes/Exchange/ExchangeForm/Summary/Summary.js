import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import { coinToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { getData } from './selectors'
import {
  ExchangeText,
  ExchangeAmount,
  AmountHeader,
  Delimiter,
  TableRow
} from 'components/Exchange'
import StringDisplay from 'components/Display/StringDisplay'

const add = (augend, addend) => new BigNumber.sum(augend, addend).toString()

export class Summary extends React.PureComponent {
  render () {
    const {
      currency,
      sourceAmount,
      sourceCoin,
      sourceFee,
      targetAmount,
      targetCoin,
      targetFiat
    } = this.props
    return (
      <React.Fragment>
        <TableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.swap'
              defaultMessage='Swap'
            />
          </AmountHeader>
          <ExchangeAmount>
            <StringDisplay>
              {sourceAmount.map(amount =>
                coinToString({
                  value: add(amount, sourceFee.source),
                  unit: { symbol: sourceCoin },
                  minDigits: 2
                })
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
        <TableRow>
          <AmountHeader>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.to'
              defaultMessage='Receive'
            />
          </AmountHeader>
          <ExchangeAmount>
            <StringDisplay>
              {targetAmount.map(amount =>
                coinToString({
                  value: amount,
                  unit: { symbol: targetCoin },
                  minDigits: 2
                })
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
        <Delimiter />
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.fees'
              defaultMessage='Fees'
            />
          </ExchangeText>
          <ExchangeAmount>
            {coinToString({
              value: sourceFee.source,
              unit: { symbol: sourceCoin },
              minDigits: 2
            })}
          </ExchangeAmount>
        </TableRow>
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.swapvalue'
              defaultMessage='Swap Value'
            />
          </ExchangeText>
          <ExchangeAmount>
            <StringDisplay>
              {targetFiat.map(amount =>
                coinToString({
                  value: amount,
                  unit: { symbol: currency },
                  minDigits: 2,
                  maxDigits: 2
                })
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
      </React.Fragment>
    )
  }
}

export default connect(getData)(Summary)
