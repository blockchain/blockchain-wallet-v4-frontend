import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'
import { SupportedWalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { mapObjIndexed, toLower, values } from 'ramda'
import styled from 'styled-components'

import { HomeBalanceRow, HomeBalanceTable } from 'components/Balances'
import CoinBalance from '../CoinBalance'
import { Props, SuccessStateType } from '.'

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

const Success = (props: Props & SuccessStateType) => {
  const { coins, viewType } = props

  return (
    <HomeBalanceTable>
      {values(
        mapObjIndexed((coin: SupportedWalletCurrencyType, i) => {
          // @ts-ignore
          if (viewType === 'Hardware' && !coin.hasLockboxSupport) return
          const link =
            viewType === 'Hardware' ? '/lockbox' : coin.txListAppRoute
          return (
            coin.method &&
            coin.invited && (
              <HomeBalanceRow
                key={i}
                data-e2e={`${toLower(coin.coinCode)}BalanceTable`}
              >
                <TxLink to={link}>
                  <div>
                    <Wrapper>
                      <Coin>
                        <CoinIcon
                          color={coin.colorCode}
                          name={coin.icons.circleFilled}
                          size={'32px'}
                        />
                        <CoinName color={'grey700'}>
                          {coin.displayName}
                        </CoinName>
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
        }, coins)
      )}
    </HomeBalanceTable>
  )
}
export default Success
