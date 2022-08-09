import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Flex } from 'components/Flex'
import { BalanceType } from 'data/components/debitCard/types'
import { convertStandardToBase } from 'data/components/exchange/services'

import CoinBalanceDisplay from './CoinBalanceDisplay'
import { Coin, CoinIcon, CoinName, FundSubTitle, Wrapper } from './CoinWithBalance.model'

const isFiat = (symbol) => window.coins[symbol].coinfig.type.name === 'FIAT'

const fundTypeLabel = (symbol: string) => {
  return (
    <FundSubTitle>
      {isFiat(symbol) ? (
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
}

// Value expected to receive the exact amount of the symbol fund
const CoinWithBalance = ({ symbol, value }: BalanceType) => {
  let convertedBalance = value
  if (!isFiat(symbol)) {
    // Only needs to convert Crypto value
    convertedBalance = convertStandardToBase(symbol, value)
  }

  return (
    <Wrapper>
      <Flex justifyContent='space-between' alignItems='center'>
        <Coin>
          <CoinIcon name={symbol as CoinType} size='32px' />
          <div>
            <CoinName>{window.coins[symbol].coinfig.name}</CoinName>
            {fundTypeLabel(symbol)}
          </div>
        </Coin>
        <CoinBalanceDisplay coin={symbol} balance={convertedBalance} />
      </Flex>
    </Wrapper>
  )
}

export default CoinWithBalance
