import React from 'react'
import PropTypes from 'prop-types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { LinkContainer } from 'react-router-bootstrap'

import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, large } = props

  return (
    <LinkContainer to='/bch/transactions'>
      <CoinBalanceWrapper large={large}>
        <CoinDisplay
          coin='BCH'
          cursor='pointer'
          mobileSize='14px'
          size={large ? '20px' : '12px'}
          weight={large ? 200 : 300}
        >
          {balance}
        </CoinDisplay>
        <FiatDisplay
          coin='BCH'
          cursor='pointer'
          mobileSize='14px'
          size={large ? '20px' : '12px'}
          weight={large ? 200 : 300}
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
