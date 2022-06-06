import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { BalanceType } from 'data/components/debitCard/types'
import { convertStandardToBase } from 'data/components/exchange/services'

import CoinBalanceDisplay from './CoinBalanceDisplay'
import { Amount, Coin, CoinIcon, CoinName, FundSubTitle, Wrapper } from './CoinWithBalance.selector'

const fundTypeLabel = (symbol: string) => (
  <FundSubTitle>
    {window.coins[symbol].coinfig.type.name === 'FIAT' ? (
      <FormattedMessage
        id='scenes.debit_card.dashboard.funds.type.cash_balance'
        defaultMessage='Cash Balance'
      />
    ) : (
      <FormattedMessage
        id='scenes.debit_card.dashboard.funds.type.trading_account'
        defaultMessage='Trading Account'
      />
    )}
  </FundSubTitle>
)

const CoinWithBalance = ({ symbol, value }: BalanceType) => (
  <div style={{ flex: 1 }}>
    <Wrapper>
      <Coin>
        <CoinIcon name={symbol as CoinType} size='32px' />
        <div>
          <CoinName>{window.coins[symbol].coinfig.name}</CoinName>
          {fundTypeLabel(symbol)}
        </div>
      </Coin>
      <Amount>
        <CoinBalanceDisplay coin={symbol} balance={convertStandardToBase(symbol, value)} />
      </Amount>
    </Wrapper>
  </div>
)

export default CoinWithBalance
