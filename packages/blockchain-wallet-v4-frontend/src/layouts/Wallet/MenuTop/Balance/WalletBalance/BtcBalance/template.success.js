import React from 'react'
import PropTypes from 'prop-types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { LinkContainer } from 'react-router-bootstrap'
import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance } = props

  return (
    <LinkContainer to='/btc/transactions'>
      <CoinBalanceWrapper>
        <CoinDisplay
          coin='BTC'
          cursor='pointer'
          size={'12px'}
          mobileSize='14px'
          weight={300}
        >
          {balance}
        </CoinDisplay>
        <FiatDisplay
          coin='BTC'
          cursor='pointer'
          size={'12px'}
          mobileSize='14px'
          weight={300}
        >
          {balance}
        </FiatDisplay>
      </CoinBalanceWrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
