import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { toLower } from 'ramda'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { CoinfigType, CoinType } from 'blockchain-wallet-v4/src/types'
import { HomeBalanceRow, HomeBalanceTable } from 'components/Balances'

import { Props } from '.'
import CoinBalance from './CoinBalance'

const TxLink = styled(LinkContainer)`
  &:hover {
    cursor: pointer;
  }
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Coin = styled.div`
  display: flex;
  align-items: center;
`
const CoinName = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.grey800};
`
const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`
const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  > div:last-child {
    margin-top: 5px;
  }
`

const Success = (props: OwnProps & Props) => {
  const useBackup = props.coins.length === 0
  const useCombo = props.coins.every((coin) => coin.type.name === 'FIAT')
  const coins = useBackup
    ? props.backupCoins
    : useCombo
    ? [...props.coins, ...props.backupCoins]
    : props.coins

  return (
    <HomeBalanceTable>
      {coins.map((val) => {
        return (
          <HomeBalanceRow
            key={val.symbol + val.name}
            data-e2e={`${toLower(val.symbol)}BalanceTable`}
          >
            <TxLink to={`/${val.symbol}/transactions`}>
              <div>
                <Wrapper>
                  <Coin>
                    <CoinIcon name={val.symbol as CoinType} size='32px' />
                    <CoinName color='grey700'>{val.name}</CoinName>
                  </Coin>
                  <Amount>
                    <CoinBalance {...props} coin={val.symbol} />
                  </Amount>
                </Wrapper>
              </div>
            </TxLink>
          </HomeBalanceRow>
        )
      })}
    </HomeBalanceTable>
  )
}

type OwnProps = {
  coins: CoinfigType[]
}

export default Success
