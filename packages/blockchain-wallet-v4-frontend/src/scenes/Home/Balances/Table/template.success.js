import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell
} from 'components/Balances'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'
import React from 'react'
import styled from 'styled-components'

const TxLink = styled(LinkContainer)`
  &:hover {
    cursor: pointer;
  }
`

const Success = props => {
  const { viewType, balances, supportedCoins } = props
  const coinOrder = [
    supportedCoins.PAX,
    supportedCoins.BTC,
    supportedCoins.ETH,
    supportedCoins.BCH,
    supportedCoins.XLM
  ]

  return (
    <HomeBalanceTable>
      {values(
        mapObjIndexed((coin, i) => {
          if (viewType === 'Hardware' && !coin.hasLockboxSupport) return
          const link =
            viewType === 'Hardware' ? '/lockbox' : coin.txListAppRoute
          return (
            coin.invited && (
              <HomeBalanceRow
                key={i}
                data-e2e={`${toLower(coin.coinCode)}BalanceTable`}
              >
                <TxLink to={link}>
                  <div>
                    <HomeCoinBalanceCell
                      coin={coin.coinCode}
                      coinName={coin.displayName}
                      coinIcon={coin.icons.circleFilled}
                      color={coin.colorCode}
                      balance={balances[`${toLower(coin.coinCode)}Balance`]}
                    />
                  </div>
                </TxLink>
              </HomeBalanceRow>
            )
          )
        }, coinOrder)
      )}
    </HomeBalanceTable>
  )
}
export default Success
