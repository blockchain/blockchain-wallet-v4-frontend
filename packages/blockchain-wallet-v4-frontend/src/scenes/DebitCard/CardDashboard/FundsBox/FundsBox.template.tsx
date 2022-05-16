import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { convertStandardToBase } from 'data/components/exchange/services'

import CoinBalance from '../../../Home/Holdings/CoinBalance/template.success'
import { BoxContainer, BoxRow, BoxRowItemSubTitle, BoxRowWithBorder } from '../CardDashboard.model'

const Coin = styled.div`
  display: flex;
  align-items: center;
`
const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`
const CoinName = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
`
const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  > div:last-child {
    margin-top: 5px;
  }
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
type Props = {
  currentCardAccount: { balance: { symbol: string; value: string } }
  funds: Array<{ balance: { symbol: string; value: string } }>
}
const FundsBox = ({ currentCardAccount, funds }: Props) => {
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

  return (
    <BoxContainer width='380px'>
      <BoxRowWithBorder>
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
