import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { SupportedWalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { HomeBalanceRow, HomeBalanceTable } from 'components/Balances'

import { Props, SuccessStateType } from '.'
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
  color: ${props => props.theme.grey800};
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

const Success = (props: Props & SuccessStateType) => (
  <HomeBalanceTable>
    {values(
      mapObjIndexed((coin: SupportedWalletCurrencyType, i) => {
        return (
          coin.method &&
          coin.invited && (
            <HomeBalanceRow
              key={i}
              data-e2e={`${toLower(coin.coinCode)}BalanceTable`}
            >
              <TxLink to={coin.txListAppRoute}>
                <div>
                  <Wrapper>
                    <Coin>
                      <CoinIcon
                        color={coin.coinCode}
                        name={coin.coinCode}
                        size='32px'
                      />
                      <CoinName color='grey700'>{coin.displayName}</CoinName>
                    </Coin>
                    <Amount>
                      <CoinBalance {...props} coin={coin.coinCode} />
                    </Amount>
                  </Wrapper>
                </div>
              </TxLink>
            </HomeBalanceRow>
          )
        )
      }, props.coins)
    )}
  </HomeBalanceTable>
)

export default Success
