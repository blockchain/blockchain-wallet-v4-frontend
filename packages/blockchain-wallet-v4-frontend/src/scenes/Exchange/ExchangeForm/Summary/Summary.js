import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import StringDisplay from 'components/Display/StringDisplay'

import { getData } from './selectors'
import {
  ExchangeText,
  ExchangeAmount,
  AmountHeader,
  Delimiter,
  TableRow
} from 'components/Exchange'

const add = (augend, addend) => new BigNumber(augend).add(addend).toString()

class Summary extends React.PureComponent {
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
        <AmountHeader>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.deposit'
            defaultMessage='Exchange {coin}'
            values={{
              coin: sourceCoin
            }}
          />
        </AmountHeader>
        <ExchangeAmount>
          <StringDisplay>
            {sourceAmount.map(
              amount => `${add(amount, sourceFee.source)} ${sourceCoin}`
            )}
          </StringDisplay>
        </ExchangeAmount>
        <AmountHeader>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.receive'
            defaultMessage='Receive {coin}'
            values={{
              coin: targetCoin
            }}
          />
        </AmountHeader>
        <ExchangeAmount>
          <StringDisplay>
            {targetAmount.map(amount => `${amount} ${targetCoin}`)}
          </StringDisplay>
        </ExchangeAmount>
        <Delimiter />
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.fee'
              defaultMessage='Network Fee'
            />
          </ExchangeText>
          <ExchangeText weight={300}>
            {sourceFee.source} {sourceCoin}
          </ExchangeText>
        </TableRow>
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.value'
              defaultMessage='~ Total Value'
            />
          </ExchangeText>
          <ExchangeText weight={300}>
            <StringDisplay>
              {targetFiat.map(amount => `${amount} ${currency}`)}
            </StringDisplay>
          </ExchangeText>
        </TableRow>
      </React.Fragment>
    )
  }
}

export default connect(getData)(Summary)
