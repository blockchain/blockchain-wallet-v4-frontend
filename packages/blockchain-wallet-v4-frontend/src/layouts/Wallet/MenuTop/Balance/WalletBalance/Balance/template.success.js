import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'

import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, coin, coinTicker, large } = props

  return (
    <LinkContainer to={`/${coin}/transactions`}>
      <div data-e2e={`balanceDropdown-wallet-${coin}`}>
        <CoinBalanceWrapper
          coin={coin}
          balance={balance}
          large={large}
          coinTicker={coinTicker}
        />
      </div>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Success
