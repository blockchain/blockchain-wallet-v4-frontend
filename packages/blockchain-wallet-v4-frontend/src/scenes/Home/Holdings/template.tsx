import React from 'react'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { CoinfigType, CoinType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { HomeBalanceRow, HomeBalanceTable } from 'components/Balances'

import CoinBalance from './CoinBalance'
import getData from './selectors'

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

const Success = ({ coins }: Props) => {
  const backupCoins = useSelector(getData).getOrElse([])

  const useBackup = coins.length === 0
  const useCombo = coins.every((coin) => coin.type.name === 'FIAT')

  const holdingsCoins = useBackup ? backupCoins : useCombo ? [...coins, ...backupCoins] : coins

  return (
    <HomeBalanceTable>
      {holdingsCoins.map(({ name, symbol }) => {
        return (
          <HomeBalanceRow key={symbol + name} data-e2e={`${symbol.toLowerCase()}BalanceTable`}>
            <TxLink to={`/coins/${symbol}`}>
              <div>
                <Wrapper>
                  <Coin>
                    <CoinIcon name={symbol as CoinType} size='32px' />
                    <CoinName color='grey700'>{name}</CoinName>
                  </Coin>
                  <Amount>
                    <CoinBalance coin={symbol} />
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

type Props = {
  coins: CoinfigType[]
}

export default Success
