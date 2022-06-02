import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType, RemoteDataType } from '@core/types'
import { Button } from 'blockchain-info-components'
import { AccountType, BalanceType } from 'data/components/debitCard/types'
import { convertStandardToBase } from 'data/components/exchange/services'

import CoinBalance from '../../../Home/Holdings/CoinBalance/template.success'
import { BoxContainer, BoxRow, BoxRowItemSubTitle, BoxRowWithBorder } from '../CardDashboard.model'
import {
  Amount,
  Coin,
  CoinIcon,
  CoinName,
  ErrorState,
  LoadingDetail,
  Wrapper
} from './FundsBox.model'

type Props = {
  currentCard: RemoteDataType<string, AccountType>
}

const FundsBox = ({ currentCard }: Props) => {
  const fundTypeLabel = (symbol: string) => (
    <BoxRowItemSubTitle>
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
    </BoxRowItemSubTitle>
  )

  const CurrentAccountDetail = ({ symbol, value }: BalanceType) => (
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
          <CoinBalance coin={symbol} balance={convertStandardToBase(symbol, value)} />
        </Amount>
      </Wrapper>
    </div>
  )

  return (
    <BoxContainer width='380px'>
      <BoxRowWithBorder>
        {currentCard.cata({
          Failure: () => <ErrorState />,
          Loading: () => <LoadingDetail />,
          NotAsked: () => <LoadingDetail />,
          Success: (value) => <CurrentAccountDetail {...value.balance} />
        })}
      </BoxRowWithBorder>
      <BoxRow>
        <Button data-e2e='addFunds' nature='primary' margin='auto' disabled>
          <FormattedMessage id='buttons.add_funds' defaultMessage='Add Funds' />
        </Button>
        <Button data-e2e='changeSource' nature='empty-blue' margin='auto' disabled>
          <FormattedMessage id='buttons.change_source' defaultMessage='Change Source' />
        </Button>
      </BoxRow>
    </BoxContainer>
  )
}

export default FundsBox
