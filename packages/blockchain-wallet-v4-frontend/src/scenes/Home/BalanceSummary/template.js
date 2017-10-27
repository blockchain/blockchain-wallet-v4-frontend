import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'
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

const BalanceSummary = (props) => {
  const { balances, total } = props

  return (
    <Wrapper>
      <Text size='24px' weight={300} color='brand-primary' uppercase>
        <FormattedMessage id='scenes.home.balancesummary.title' defaultMessage='Your balances' />
      </Text>
      <FirstRow>
        <Text size='28px' weight={300}>
          <CurrencyDisplay>{total}</CurrencyDisplay>
        </Text>
      </FirstRow>
      { balances.map(function (balance, index) {
        return (
          <Row key={index} last={index === balances.length - 1}>
            <Text size='16px' weight={300}>{balance.title}</Text>
            <Amount>
              <Text size='16px' weight={300}>
                <CoinDisplay coin='BTC'>{balance.amount}</CoinDisplay>
              </Text>
              <Text size='12px' weight={300}>
                <CurrencyDisplay>{balance.amount}</CurrencyDisplay>
              </Text>
            </Amount>
          </Row>
        )
      })}
    </Wrapper>
  )
}

BalanceSummary.propTypes = {
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number
    })
  ),
  total: PropTypes.number.isRequired
}

BalanceSummary.defaultProps = {
  total: 0
}

export default BalanceSummary
