import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import { setMinDecimals } from 'blockchain-wallet-v4/src/utils/bigNumber'
import { getData } from './selectors'
import {
  ExchangeText,
  ExchangeAmount,
  AmountHeader,
  Delimiter,
  TableRow
} from 'components/Exchange'
import StringDisplay from 'components/Display/StringDisplay'

const add = (augend, addend) => new BigNumber(augend).add(addend).toString()

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
                amount =>
                  `${setMinDecimals(
                    add(amount, sourceFee.source),
                    2
                  )} ${sourceCoin}`
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
        <TableRow>
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
              {targetAmount.map(
                amount => `${setMinDecimals(amount, 2)} ${targetCoin}`
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
        <Delimiter />
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.fee'
              defaultMessage='Network Fee'
            />
          </ExchangeText>
          <ExchangeAmount>
            {setMinDecimals(sourceFee.source, 2)} {sourceCoin}
          </ExchangeAmount>
        </TableRow>
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.summary.value'
              defaultMessage='~ Total Value'
            />
          </ExchangeText>
          <ExchangeAmount>
            <StringDisplay>
              {targetFiat.map(
                amount => `${setMinDecimals(amount, 2)} ${currency}`
              )}
            </StringDisplay>
          </ExchangeAmount>
        </TableRow>
      </React.Fragment>
    )
  }
}

export default connect(getData)(Summary)
