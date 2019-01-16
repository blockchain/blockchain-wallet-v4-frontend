import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Wrapper as BorderWrapper, Title, Note } from 'components/Exchange'
import Volume from './Volume'
import RatesBox from '../RatesBox'

export default class Summary extends React.PureComponent {
  render () {
    const { showDemoSummary, sourceCoin, targetCoin, currency } = this.props
    return showDemoSummary ? (
      ''
    ) : (
      <BorderWrapper>
        <Title>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.title'
            defaultMessage='Summary'
          />
        </Title>
        <Volume
          sourceCoin={sourceCoin}
          targetCoin={targetCoin}
          currency={currency}
        />
        <Note>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.note'
            defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
          />
        </Note>
        <RatesBox
          sourceCoin={sourceCoin}
          targetCoin={targetCoin}
          currency={currency}
        />
      </BorderWrapper>
    )
  }
}
