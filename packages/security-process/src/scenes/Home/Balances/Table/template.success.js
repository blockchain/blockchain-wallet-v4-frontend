import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedHTMLMessage } from 'react-intl'
import { mapObjIndexed, toLower, values } from 'ramda'

import { Text } from 'blockchain-info-components'
import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell
} from 'components/Balances'

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const HomeTitle = styled.div`
  flex-grow: 1;
  padding: 10px 20px;
`
const HomeBalanceAmount = styled(Text)`
  padding: 10px 20px;
  font-size: 22px;
  font-weight: 400;
  color: ${props => props.theme['brand-primary']};
`
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
      <TotalRow>
        <HomeTitle>
          <Text size='20px' weight={400}>
            <FormattedHTMLMessage
              id='components.balances.home.total'
              defaultMessage='{viewType} Balance'
              values={{ viewType }}
            />
          </Text>
        </HomeTitle>
        <div>
          <HomeBalanceAmount data-e2e='homeBalanceAmt'>
            {balances.totalBalance.totalBalance}
          </HomeBalanceAmount>
        </div>
      </TotalRow>
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
