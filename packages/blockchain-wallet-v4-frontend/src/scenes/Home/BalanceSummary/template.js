import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Row = styled(FirstRow)`
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: ${props => props.last ? 'none' : '1px solid ' + props.theme['']};
`
const Amount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
`

const BalanceSummary = ({ bitcoinBalances, total }) => (
  <Wrapper>
    <Text size='24px' weight={300} color='brand-primary' uppercase>
      <FormattedMessage id='scenes.home.balancesummary.title' defaultMessage='Your balances' />
    </Text>
    <FirstRow>
      <FiatDisplay coin='BTC' size='28px' weight={300}>{total}</FiatDisplay>
    </FirstRow>
    {bitcoinBalances.map((balance, index) => (
      <Row key={index} last={index === bitcoinBalances.length - 1}>
        <Text size='16px' weight={300}>{balance.title}</Text>
        <Amount>
          <CoinDisplay coin='BTC' size='16px' weight={300}>{balance.amount}</CoinDisplay>
          <FiatDisplay coin='BTC' size='12px' weight={300}>{balance.amount}</FiatDisplay>
        </Amount>
      </Row>
    ))}
  </Wrapper>
)

BalanceSummary.propTypes = {
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number
    })
  ),
  total: PropTypes.number.isRequired
}

export default BalanceSummary
