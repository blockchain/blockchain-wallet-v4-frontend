import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CoinType } from '@core/types'
import { Button } from 'blockchain-info-components'
import { getCurrentCardAccount } from 'data/components/debitCard/selectors'
import { AccountType } from 'data/components/debitCard/types'
import { convertStandardToBase } from 'data/components/exchange/services'
import { useRemote } from 'hooks'

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
  funds: Array<AccountType>
}

const DEFAULT_ACCOUNT = { balance: { symbol: 'USD', value: '0' } }

const FundsBox = ({ funds }: Props) => {
  const currentCardAccountRemote = useRemote(getCurrentCardAccount)
  const { data, error, isLoading } = currentCardAccountRemote
  let currentCardAccount = DEFAULT_ACCOUNT

  // Waiting for BE to fix this response
  if (data && data.balance) currentCardAccount = data

  const { symbol, value } = currentCardAccount.balance

  const fundTypeLabel = () => (
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

  const CurrentAccountDetail = () => (
    <div style={{ flex: 1 }}>
      <Wrapper>
        <Coin>
          <CoinIcon name={symbol as CoinType} size='32px' />
          <div>
            <CoinName>{window.coins[symbol].coinfig.name}</CoinName>
            {fundTypeLabel()}
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
        {error ? <ErrorState /> : !data || isLoading ? <LoadingDetail /> : <CurrentAccountDetail />}
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
