import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedHTMLMessage } from 'react-intl'
import { mapObjIndexed, toLower, values } from 'ramda'

import { model } from 'data'
import { Text } from 'blockchain-info-components'
import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell
} from 'components/Balances'

const { HOMEPAGE_BALANCE_LIST } = model.coins
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
  font-weight: 300;
  color: ${props => props.theme['brand-primary']};
`
const TxLink = styled(LinkContainer)`
  &:hover {
    cursor: pointer;
  }
`
const Success = props => {
  const { viewType, balances } = props
  return (
    <HomeBalanceTable>
      <TotalRow>
        <HomeTitle>
          <Text size='20px' weight={300}>
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
        mapObjIndexed(
          (coin, i) => (
            <HomeBalanceRow
              key={i}
              data-e2e={`${toLower(coin.coinCode)}BalanceTable`}
            >
              <TxLink to={coin.txListAppRoute}>
                <div>
                  <HomeCoinBalanceCell
                    coin={coin.coinCode}
                    coinName={coin.displayName}
                    coinIcon={coin.icons.circleFilled}
                    balance={balances.paxBalance}
                  />
                </div>
              </TxLink>
            </HomeBalanceRow>
          ),
          HOMEPAGE_BALANCE_LIST
        )
      )}
    </HomeBalanceTable>
  )
}
export default Success
